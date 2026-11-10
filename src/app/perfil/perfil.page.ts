import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnimationController, type Animation } from '@ionic/angular/lazy';
import { SesionService } from '../acceso/sesion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnDestroy {
  private readonly sesion = inject(SesionService);
  private readonly animaciones = inject(AnimationController);
  private animacionCampos?: Animation;
  @ViewChild('campoNombre', { read: ElementRef, static: true }) private campoNombre!: ElementRef<HTMLElement>;
  @ViewChild('campoApellido', { read: ElementRef, static: true }) private campoApellido!: ElementRef<HTMLElement>;

  readonly perfil = this.sesion.perfil;
  readonly mensaje = signal('');
  readonly error = signal('');
  borrador = { nombre: '', apellido: '', correo: '' };

  // Carga los datos guardados como borrador cada vez que se abre Perfil.
  ionViewWillEnter(): void {
    this.cargarPerfil();
    this.mensaje.set('');
    this.error.set('');
  }

  // Valida los campos y aplica los cambios del borrador al perfil.
  guardar(formulario: NgForm): void {
    this.mensaje.set('');
    this.error.set('');
    const nombre = this.borrador.nombre.trim();
    const apellido = this.borrador.apellido.trim();
    const correo = this.borrador.correo.trim();
    if (!nombre || !apellido || !correo || formulario.invalid) {
      this.error.set('Completa el nombre, el apellido y un correo válido.');
      return;
    }

    try {
      if (!this.sesion.actualizarPerfil({ nombre, apellido, correo })) {
        this.error.set('No encontramos la cuenta activa.');
        return;
      }
      this.cargarPerfil(formulario);
      this.mensaje.set('Perfil actualizado.');
    } catch {
      this.error.set('No pudimos guardar el perfil. Vuelve a intentarlo.');
    }
  }

  // Recupera los valores guardados y anima los campos de nombre y apellido durante un segundo.
  restablecer(formulario: NgForm): void {
    this.cargarPerfil(formulario);
    this.mensaje.set('');
    this.error.set('');
    this.animacionCampos?.destroy();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.animacionCampos = this.animaciones.create()
      .addElement([this.campoNombre.nativeElement, this.campoApellido.nativeElement])
      .duration(1000)
      .iterations(1)
      .easing('ease-out')
      .fromTo('transform', 'translateX(-14px)', 'translateX(0)');
    void this.animacionCampos.play();
  }

  ngOnDestroy(): void {
    this.animacionCampos?.destroy();
  }

  private cargarPerfil(formulario?: NgForm): void {
    const perfil = this.perfil();
    if (!perfil) return;
    const { nombre, apellido, correo } = perfil;
    this.borrador = { nombre, apellido, correo };
    formulario?.resetForm(this.borrador);
  }
}
