const dosDigitos = (valor: number): string => String(valor).padStart(2, '0');

// Guardamos el día que eligió el usuario, sin convertirlo a UTC.
export function claveFecha(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

// Crea bloques de 30 minutos desde las 09:00; el último comienza a las 17:30.
const BLOQUES = Array.from({ length: 18 }, (_, indice) => {
  const minutos = 9 * 60 + indice * 30;
  return `${dosDigitos(Math.floor(minutos / 60))}:${dosDigitos(minutos % 60)}`;
});

// Descarta fechas inválidas, horas que ya pasaron y bloques ocupados.
export function bloquesLibres(fecha: string, ocupados: readonly string[], ahora = new Date()): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  const [anio, mes, dia] = fecha.split('-').map(Number);
  if (claveFecha(new Date(anio, mes - 1, dia)) !== fecha || fecha < claveFecha(ahora)) return [];

  return BLOQUES.filter(hora => {
    const [horas, minutos] = hora.split(':').map(Number);
    const inicio = new Date(anio, mes - 1, dia, horas, minutos);
    return inicio > ahora && !ocupados.includes(hora);
  });
}
