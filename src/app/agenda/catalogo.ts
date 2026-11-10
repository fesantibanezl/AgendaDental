export const PRESTACIONES = [
  { id: 'evaluacion', nombre: 'Evaluación dental' },
  { id: 'limpieza', nombre: 'Limpieza dental' },
  { id: 'ortodoncia', nombre: 'Ortodoncia' },
  { id: 'restauracion', nombre: 'Restauración dental' },
  { id: 'odontopediatria', nombre: 'Odontopediatría' },
] as const;

type PrestacionId = typeof PRESTACIONES[number]['id'];

interface Profesional {
  id: string;
  nombre: string;
  prestaciones: readonly PrestacionId[];
}

// Cada profesional ficticio está asociado a las prestaciones que puede atender.
export const PROFESIONALES: readonly Profesional[] = [
  { id: 'camila', nombre: 'Dra. Camila Fuentes', prestaciones: ['evaluacion', 'limpieza'] },
  { id: 'diego', nombre: 'Dr. Diego Morales', prestaciones: ['limpieza', 'evaluacion'] },
  { id: 'valentina', nombre: 'Dra. Valentina Rojas', prestaciones: ['ortodoncia'] },
  { id: 'nicolas', nombre: 'Dr. Nicolás Herrera', prestaciones: ['restauracion'] },
  { id: 'sofia', nombre: 'Dra. Sofía Muñoz', prestaciones: ['odontopediatria'] },
];
