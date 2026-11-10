import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular/lazy';
import { PASSWORD_RULES, USERNAME_HELP, USERNAME_PATTERN, validPassword } from '../acceso/reglas-acceso';
import { SesionService } from '../acceso/sesion.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  private readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);
  readonly reglasClave = PASSWORD_RULES;
  readonly ayudaUsuario = USERNAME_HELP;

  nombre = '';
  apellido = '';
  correo = '';
  usuario = '';
  clave = '';
  confirmacion = '';
  readonly error = signal('');
  readonly enviando = signal(false);

  // Valida los datos, las reglas de contraseña y la confirmación antes de crear la cuenta.
  async registrar(formulario: NgForm): Promise<void> {
    if (this.enviando()) return;
    this.error.set('');
    const nombre = this.nombre.trim();
    const apellido = this.apellido.trim();
    const correo = this.correo.trim();
    if (!nombre || !apellido || !correo || formulario.controls['correo']?.invalid) {
      this.error.set('Completa tu nombre, apellido y un correo válido.');
      return;
    }
    if (!USERNAME_PATTERN.test(this.usuario)) {
      this.error.set('Revisa el nombre de usuario. ' + USERNAME_HELP);
      return;
    }
    if (!validPassword(this.clave)) {
      this.error.set('La contraseña debe cumplir todas las reglas indicadas.');
      return;
    }
    if (this.confirmacion !== this.clave) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.enviando.set(true);
    try {
      // Guarda la cuenta local y, si se crea, vuelve a Login con el usuario rellenado.
      const resultado = await this.sesion.registrar({ usuario: this.usuario, nombre, apellido, correo }, this.clave);
      if (resultado === 'duplicada') {
        this.error.set('Ese usuario ya existe. Elige otro.');
        return;
      }
      if (resultado !== 'creada') {
        this.error.set('Revisa el usuario y la contraseña.');
        return;
      }
      const usuarioRegistrado = this.usuario.toLowerCase();
      formulario.resetForm({ nombre: '', apellido: '', correo: '', usuario: '', clave: '', confirmacion: '' });
      await this.nav.navigateRoot(['/login'], { replaceUrl: true, state: { usuarioRegistrado } });
    } catch {
      this.error.set('No pudimos guardar la cuenta. Vuelve a intentarlo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
