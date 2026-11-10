import { SesionService } from './sesion.service';

describe('acceso con la cuenta de demostración', () => {
  let sesion: SesionService;

  function limpiarSesion(): void {
    localStorage.removeItem('agendadental.cuentas.v1');
    sessionStorage.removeItem('agendadental.sesion.v1');
  }

  beforeEach(() => {
    limpiarSesion();
    sesion = new SesionService();
  });

  afterEach(limpiarSesion);

  it('permite entrar sin registro previo y conserva las ediciones del perfil', async () => {
    expect(await sesion.ingresar('Dental07', 'Turno2026!')).toBe(true);
    expect(sesion.perfil()?.usuario).toBe('dental07');
    expect(sesion.actualizarPerfil({ nombre: 'Ana', apellido: 'Demo', correo: 'ana@example.com' })).toBe(true);

    sesion.salir();

    expect(await sesion.ingresar('Dental07', 'Turno2026!')).toBe(true);
    expect(sesion.perfil()?.nombre).toBe('Ana');
  });

  it('rechaza la contraseña incorrecta y respeta una cuenta registrada con ese usuario', async () => {
    expect(await sesion.ingresar('Dental07', 'Otra2026!')).toBe(false);
    expect(await sesion.registrar({
      usuario: 'Dental07', nombre: 'Ana', apellido: 'Prueba', correo: 'ana@example.com',
    }, 'Otra2026!')).toBe('creada');

    expect(await sesion.ingresar('Dental07', 'Turno2026!')).toBe(false);
    expect(await sesion.ingresar('Dental07', 'Otra2026!')).toBe(true);
    expect(sesion.perfil()?.nombre).toBe('Ana');
  });
});
