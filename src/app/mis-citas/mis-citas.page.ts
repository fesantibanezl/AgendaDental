import { Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { AnimationController, NavController, type Animation } from '@ionic/angular/lazy';
import { SesionService } from '../acceso/sesion.service';
import { CitasService } from '../agenda/citas.service';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.page.html',
  styleUrls: ['./mis-citas.page.scss'],
  standalone: false,
})
export class MisCitasPage implements OnDestroy {
  private readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);
  private readonly agenda = inject(CitasService);
  private readonly animaciones = inject(AnimationController);
  private readonly seleccion = signal<string | null>(null);
  private animacionSaludo?: Animation;
  @ViewChild('saludo', { read: ElementRef, static: true }) private saludo!: ElementRef<HTMLElement>;

  readonly perfil = this.sesion.perfil;
  readonly citas = this.agenda.misCitas;
  readonly detalle = computed(() => this.citas().find(cita => cita.id === this.seleccion()) ?? null);
  readonly confirmarCancelacion = signal(false);
  readonly error = signal('');

  // Actualiza la lista al volver de una reserva o abrir la página.
  ionViewWillEnter(): void {
    this.agenda.sincronizar();
  }

  // AnimationController anima el saludo cuando termina la entrada a la página.
  ionViewDidEnter(): void {
    this.animacionSaludo?.destroy();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.animacionSaludo = this.animaciones.create()
      .addElement(this.saludo.nativeElement)
      .duration(520)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(14px)', 'translateY(0)');
    void this.animacionSaludo.play();
  }

  // El ID seleccionado determina qué cita aparece en el modal.
  abrirDetalle(id: string): void {
    this.error.set('');
    this.seleccion.set(id);
  }

  cerrarDetalle(): void {
    this.confirmarCancelacion.set(false);
    this.seleccion.set(null);
  }

  // Confirma la cancelación y actualiza la cita mostrada sin salir del detalle.
  cancelarCita(): void {
    const cita = this.detalle();
    if (!cita) return;
    this.error.set('');
    try {
      if (!this.agenda.cancelar(cita.id)) {
        this.agenda.sincronizar();
        this.error.set('La cita ya no está disponible para cancelar.');
      }
      this.confirmarCancelacion.set(false);
    } catch {
      this.error.set('No pudimos cancelar la cita. Vuelve a intentarlo.');
    }
  }

  cerrarSesion(): void {
    this.cerrarDetalle();
    this.sesion.salir();
    void this.nav.navigateRoot(['/login'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.animacionSaludo?.destroy();
  }
}
