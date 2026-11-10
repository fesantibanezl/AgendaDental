import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';
import { PRESTACIONES, PROFESIONALES } from '../agenda/catalogo';
import { CitasService } from '../agenda/citas.service';
import { claveFecha } from '../agenda/horarios';

@Component({
  selector: 'app-reservar-cita',
  templateUrl: './reservar-cita.page.html',
  styleUrls: ['./reservar-cita.page.scss'],
  standalone: false,
})
export class ReservarCitaPage {
  private readonly citas = inject(CitasService);
  private readonly nav = inject(NavController);
  readonly prestaciones = PRESTACIONES;
  readonly error = signal('');
  readonly guardando = signal(false);

  prestacion = '';
  profesional = '';
  fecha: Date | null = null;
  hora = '';
  hoy = new Date();
  horarios: string[] = [];
  citaRepetida = false;

  // Filtra el catálogo según la prestación elegida.
  get profesionales() {
    return PROFESIONALES.filter(persona => persona.prestaciones.some(id => id === this.prestacion));
  }

  // Al entrar a la página, actualiza la fecha mínima y prepara una reserva nueva.
  ionViewWillEnter(): void {
    this.hoy = new Date();
    this.prestacion = '';
    this.profesional = '';
    this.fecha = null;
    this.hora = '';
    this.horarios = [];
    this.citaRepetida = false;
    this.error.set('');
  }

  elegirPrestacion(id: string): void {
    this.prestacion = id;
    this.profesional = '';
    this.fecha = null;
    this.actualizarHorarios();
  }

  elegirProfesional(id: string): void {
    this.profesional = id;
    this.actualizarHorarios();
  }

  elegirFecha(fecha: Date | null): void {
    this.fecha = fecha;
    this.actualizarHorarios();
  }

  // Comprueba que el formulario esté completo y vuelve a Mis citas si la reserva se guarda.
  async reservar(): Promise<void> {
    if (this.guardando() || this.citaRepetida) return;
    this.error.set('');
    if (!this.prestacion || !this.profesional || !this.fecha || !this.hora) {
      this.error.set('Selecciona la prestación, el profesional, la fecha y la hora.');
      return;
    }

    this.guardando.set(true);
    try {
      const resultado = this.citas.reservar({
        prestacionId: this.prestacion,
        profesionalId: this.profesional,
        fecha: claveFecha(this.fecha),
        hora: this.hora,
      });
      if (resultado === 'confirmada') {
        await this.nav.navigateBack(['/mis-citas']);
      } else if (resultado === 'duplicada') {
        this.actualizarHorarios();
      } else if (resultado === 'ocupada') {
        this.actualizarHorarios();
        this.error.set('Ese horario ya no está disponible. Elige otra hora.');
      } else {
        this.error.set('Revisa los datos de la cita antes de reservar.');
      }
    } catch {
      this.error.set('No pudimos guardar la cita. Vuelve a intentarlo.');
    } finally {
      this.guardando.set(false);
    }
  }

  // Al cambiar la fecha o el profesional, borra la hora elegida y consulta la disponibilidad.
  private actualizarHorarios(): void {
    this.hora = '';
    this.error.set('');
    const disponibilidad = this.fecha && this.profesional
      ? this.citas.disponibilidad(this.profesional, claveFecha(this.fecha))
      : null;
    this.horarios = disponibilidad?.horarios ?? [];
    this.citaRepetida = disponibilidad?.repetida ?? false;
  }
}
