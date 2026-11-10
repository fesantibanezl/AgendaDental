import { bloquesLibres, claveFecha } from './horarios';

describe('bloques de la agenda dental', () => {
  const ahora = new Date(2026, 10, 9, 10, 15);

  it('ofrece 18 turnos de media hora y el último termina a las 18:00', () => {
    const bloques = bloquesLibres('2026-11-10', [], ahora);
    expect(bloques).toHaveLength(18);
    expect(bloques[0]).toBe('09:00');
    expect(bloques.at(-1)).toBe('17:30');
  });

  it('excluye las horas transcurridas y las ocupadas por el profesional', () => {
    const bloques = bloquesLibres(claveFecha(ahora), ['11:00'], ahora);
    expect(bloques[0]).toBe('10:30');
    expect(bloques).not.toContain('10:00');
    expect(bloques).not.toContain('11:00');
  });

  it('rechaza las fechas pasadas e inexistentes', () => {
    expect(bloquesLibres('2026-11-08', [], ahora)).toEqual([]);
    expect(bloquesLibres('2026-11-31', [], ahora)).toEqual([]);
  });
});
