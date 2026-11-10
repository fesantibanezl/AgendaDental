import { Injectable, signal } from '@angular/core';
import { USERNAME_PATTERN, validPassword } from './reglas-acceso';

export interface PerfilPaciente {
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
}

interface CuentaLocal {
  perfil: PerfilPaciente;
  sal: number[];
  verificador: string;
}

// Las cuentas se guardan en el navegador; la sesión solo recuerda el usuario de la pestaña.
const CUENTAS = 'agendadental.cuentas.v1';
const SESION = 'agendadental.sesion.v1';
const PERFIL_DEMO: PerfilPaciente = {
  usuario: 'dental07',
  nombre: 'Paciente',
  apellido: 'Demo',
  correo: 'dental07@example.com',
};
const CLAVE_DEMO = 'Turno2026!';

function leerCuentas(): CuentaLocal[] {
  try {
    const cuentas: unknown = JSON.parse(localStorage.getItem(CUENTAS) ?? '[]');
    return Array.isArray(cuentas) ? cuentas : [];
  } catch {
    return [];
  }
}

function leerSesion(): PerfilPaciente | null {
  try {
    const usuario = sessionStorage.getItem(SESION);
    return leerCuentas().find(cuenta => cuenta.perfil.usuario === usuario)?.perfil ?? null;
  } catch {
    return null;
  }
}

// Genera el valor que se compara al ingresar, sin guardar la contraseña en texto plano.
async function verificarClave(clave: string, sal: number[]): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: Uint8Array.from(sal), iterations: 600_000 },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly perfilActivo = signal<PerfilPaciente | null>(leerSesion());
  readonly perfil = this.perfilActivo.asReadonly();

  // Comprueba las reglas y que el usuario esté libre antes de guardar la cuenta.
  async registrar(perfil: PerfilPaciente, clave: string): Promise<'creada' | 'duplicada' | 'invalida'> {
    if (!USERNAME_PATTERN.test(perfil.usuario) || !validPassword(clave)) return 'invalida';
    const usuario = perfil.usuario.toLowerCase();
    if (leerCuentas().some(cuenta => cuenta.perfil.usuario === usuario)) return 'duplicada';

    const sal = Array.from(crypto.getRandomValues(new Uint8Array(16)));
    const verificador = await verificarClave(clave, sal);
    const cuentas = leerCuentas();
    if (cuentas.some(cuenta => cuenta.perfil.usuario === usuario)) return 'duplicada';

    cuentas.push({ perfil: { ...perfil, usuario }, sal, verificador });
    localStorage.setItem(CUENTAS, JSON.stringify(cuentas));
    return 'creada';
  }

  // Busca la cuenta y activa la sesión solo si la contraseña coincide.
  async ingresar(usuario: string, clave: string): Promise<boolean> {
    if (!USERNAME_PATTERN.test(usuario) || !validPassword(clave)) return false;
    const usuarioNormalizado = usuario.toLowerCase();
    let cuenta = leerCuentas().find(item => item.perfil.usuario === usuarioNormalizado);

    // Crea la cuenta ficticia al primer acceso y conserva cualquier cuenta ya registrada.
    if (!cuenta && usuarioNormalizado === PERFIL_DEMO.usuario && clave === CLAVE_DEMO) {
      await this.registrar(PERFIL_DEMO, clave);
      cuenta = leerCuentas().find(item => item.perfil.usuario === usuarioNormalizado);
    }

    if (!cuenta || await verificarClave(clave, cuenta.sal) !== cuenta.verificador) return false;

    sessionStorage.setItem(SESION, cuenta.perfil.usuario);
    this.perfilActivo.set(cuenta.perfil);
    return true;
  }

  // Guarda los datos del perfil y actualiza el nombre que ven las demás páginas.
  actualizarPerfil(datos: Pick<PerfilPaciente, 'nombre' | 'apellido' | 'correo'>): boolean {
    const usuario = this.perfilActivo()?.usuario;
    if (!usuario) return false;

    const cuentas = leerCuentas();
    const indice = cuentas.findIndex(cuenta => cuenta.perfil.usuario === usuario);
    if (indice === -1) return false;

    const perfil = { ...datos, usuario };
    cuentas[indice] = { ...cuentas[indice], perfil };
    localStorage.setItem(CUENTAS, JSON.stringify(cuentas));
    this.perfilActivo.set(perfil);
    return true;
  }

  // Borra el usuario de la sesión; la cuenta queda guardada.
  salir(): void {
    sessionStorage.removeItem(SESION);
    this.perfilActivo.set(null);
  }
}
