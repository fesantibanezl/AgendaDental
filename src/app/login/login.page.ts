import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular/lazy';
import { SesionService } from '../acceso/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  usuario = '';
  clave = '';
  readonly error = signal('');
  readonly cuentaCreada = signal(false);
  readonly enviando = signal(false);

  // Al volver de Registro, recupera el usuario y deja vacío el campo de contraseña.
  ionViewWillEnter(): void {
    const estado = (this.router.currentNavigation()?.extras.state ?? this.location.getState()) as
      { usuarioRegistrado?: unknown } | null;
    this.cuentaCreada.set(typeof estado?.usuarioRegistrado === 'string');
    this.usuario = typeof estado?.usuarioRegistrado === 'string' ? estado.usuarioRegistrado : '';
    this.clave = '';
    this.error.set('');
  }

  // Valida el acceso y abre Mis citas solo cuando el ingreso es correcto.
  async ingresar(): Promise<void> {
    if (this.enviando()) return;
    this.error.set('');
    if (!this.usuario || !this.clave) {
      this.error.set('Ingresa tu usuario y tu contraseña.');
      return;
    }

    this.enviando.set(true);
    try {
      if (!await this.sesion.ingresar(this.usuario, this.clave)) {
        this.error.set('El usuario o la contraseña no coinciden.');
        return;
      }
      this.clave = '';
      await this.nav.navigateRoot(['/mis-citas'], { replaceUrl: true });
    } catch {
      this.error.set('No pudimos iniciar sesión. Vuelve a intentarlo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
