import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SesionService, type PerfilPaciente } from '../acceso/sesion.service';
import { CitasService } from './citas.service';
import { claveFecha } from './horarios';

describe('una cita activa por profesional y día', () => {
  const claveCitas = 'agendadental.citas.v1';
  const perfil = signal<PerfilPaciente>({ usuario: 'ana01', nombre: 'Ana', apellido: 'Prueba', correo: 'ana@example.com' });
  const futuro = new Date();
  futuro.setDate(futuro.getDate() + 2);
  const datos = { prestacionId: 'evaluacion', profesionalId: 'camila', fecha: claveFecha(futuro), hora: '09:00' };
  let agenda: CitasService;

  beforeEach(() => {
    localStorage.removeItem(claveCitas);
    perfil.update(valor => ({ ...valor, usuario: 'ana01' }));
    TestBed.configureTestingModule({ providers: [{ provide: SesionService, useValue: { perfil } }] });
    agenda = TestBed.inject(CitasService);
  });

  afterEach(() => localStorage.removeItem(claveCitas));

  it('impide otra cita con la misma profesional ese día aunque cambien la hora y la prestación', () => {
    expect(agenda.reservar(datos)).toBe('confirmada');
    expect(agenda.disponibilidad('camila', datos.fecha)).toEqual({ horarios: [], repetida: true });
    expect(agenda.reservar({ ...datos, prestacionId: 'limpieza', hora: '09:30' })).toBe('duplicada');
    expect(agenda.misCitas()).toHaveLength(1);
  });

  it('permite cambiar de profesional o de día', () => {
    expect(agenda.reservar(datos)).toBe('confirmada');
    expect(agenda.reservar({ ...datos, profesionalId: 'diego', hora: '09:30' })).toBe('confirmada');
    const otroDia = new Date(futuro);
    otroDia.setDate(otroDia.getDate() + 1);
    expect(agenda.reservar({ ...datos, fecha: claveFecha(otroDia) })).toBe('confirmada');
  });

  it('permite a otro paciente reservar con la misma profesional ese día en otro bloque', () => {
    expect(agenda.reservar(datos)).toBe('confirmada');
    perfil.update(valor => ({ ...valor, usuario: 'bea02' }));
    expect(agenda.reservar(datos)).toBe('ocupada');
    expect(agenda.reservar({ ...datos, hora: '09:30' })).toBe('confirmada');
  });

  it('permite una nueva cita después de cancelar la anterior', () => {
    expect(agenda.reservar(datos)).toBe('confirmada');
    expect(agenda.cancelar(agenda.misCitas()[0].id)).toBe(true);
    expect(agenda.disponibilidad('camila', datos.fecha).repetida).toBe(false);
    expect(agenda.reservar({ ...datos, hora: '09:30' })).toBe('confirmada');
  });
});
