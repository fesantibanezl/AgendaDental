import { Injectable, computed, inject, signal } from '@angular/core';
import { SesionService } from '../acceso/sesion.service';
import { PRESTACIONES, PROFESIONALES } from './catalogo';
import { bloquesLibres } from './horarios';

interface DatosReserva {
  prestacionId: string;
  profesionalId: string;
  fecha: string;
  hora: string;
}

export interface Cita extends DatosReserva {
  id: string;
  usuario: string;
  prestacion: string;
  profesional: string;
  estado: 'Confirmada' | 'Cancelada';
}

const CLAVE_CITAS = 'agendadental.citas.v1';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly sesion = inject(SesionService);
  private readonly citas = signal<Cita[]>(this.leerCitas());

  // Muestra solo las citas de la cuenta activa, ordenadas por día y hora.
  readonly misCitas = computed(() => {
    const usuario = this.sesion.perfil()?.usuario;
    return this.citas()
      .filter(cita => cita.usuario === usuario)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  });

  sincronizar(): void {
    this.citas.set(this.leerCitas());
  }

  // Oculta los horarios si el paciente ya tiene cita con ese profesional ese día.
  disponibilidad(profesionalId: string, fecha: string): { horarios: string[]; repetida: boolean } {
    const citas = this.leerCitas();
    const repetida = this.yaTieneCita(citas, this.sesion.perfil()?.usuario, profesionalId, fecha);
    return { horarios: repetida ? [] : this.disponibles(citas, profesionalId, fecha), repetida };
  }

  // Antes de guardar, vuelve a comprobar la regla diaria y que el bloque siga libre.
  reservar(datos: DatosReserva): 'confirmada' | 'duplicada' | 'ocupada' | 'invalida' {
    const usuario = this.sesion.perfil()?.usuario;
    const prestacion = PRESTACIONES.find(item => item.id === datos.prestacionId);
    const profesional = PROFESIONALES.find(item => item.id === datos.profesionalId);
    if (!usuario || !prestacion || !profesional?.prestaciones.includes(prestacion.id)) return 'invalida';

    const citas = this.leerCitas();
    if (this.yaTieneCita(citas, usuario, profesional.id, datos.fecha)) return 'duplicada';
    if (!this.disponibles(citas, profesional.id, datos.fecha).includes(datos.hora)) return 'ocupada';

    this.guardar([...citas, {
      ...datos,
      id: crypto.randomUUID(),
      usuario,
      prestacion: prestacion.nombre,
      profesional: profesional.nombre,
      estado: 'Confirmada',
    }]);
    return 'confirmada';
  }

  // Marca la cita como cancelada para conservar el historial y liberar el horario.
  cancelar(id: string): boolean {
    const usuario = this.sesion.perfil()?.usuario;
    const citas = this.leerCitas();
    const indice = citas.findIndex(cita => cita.id === id && cita.usuario === usuario && cita.estado === 'Confirmada');
    if (indice === -1) return false;

    citas[indice] = { ...citas[indice], estado: 'Cancelada' };
    this.guardar(citas);
    return true;
  }

  private yaTieneCita(citas: Cita[], usuario: string | undefined, profesionalId: string, fecha: string): boolean {
    return !!usuario && citas.some(cita =>
      cita.estado === 'Confirmada' && cita.usuario === usuario &&
      cita.profesionalId === profesionalId && cita.fecha === fecha,
    );
  }

  private disponibles(citas: Cita[], profesionalId: string, fecha: string): string[] {
    const ocupados = citas
      .filter(cita => cita.profesionalId === profesionalId && cita.fecha === fecha && cita.estado === 'Confirmada')
      .map(cita => cita.hora);
    return bloquesLibres(fecha, ocupados);
  }

  // Lee y guarda las reservas de la demo en el almacenamiento del navegador.
  private leerCitas(): Cita[] {
    try {
      const datos: unknown = JSON.parse(localStorage.getItem(CLAVE_CITAS) ?? '[]');
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }

  private guardar(citas: Cita[]): void {
    localStorage.setItem(CLAVE_CITAS, JSON.stringify(citas));
    this.citas.set(citas);
  }
}
