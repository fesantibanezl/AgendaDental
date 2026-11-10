export const USERNAME_PATTERN = /^[a-zA-Z0-9]{3,8}$/;
export const USERNAME_HELP = 'Usa de 3 a 8 letras (A–Z) o números, sin espacios.';

// Registro muestra estas reglas y el servicio las reutiliza para validar la contraseña.
export const PASSWORD_RULES = [
  { label: 'Entre 8 y 20 caracteres', matches: (value: string) => value.length >= 8 && value.length <= 20 },
  { label: 'Sin espacios', matches: (value: string) => !/\s/.test(value) && value.length > 0 },
  { label: 'Al menos una mayúscula', matches: (value: string) => /\p{Lu}/u.test(value) },
  { label: 'Al menos una minúscula', matches: (value: string) => /\p{Ll}/u.test(value) },
  { label: 'Al menos un número', matches: (value: string) => /[0-9]/.test(value) },
  { label: 'Al menos un símbolo, por ejemplo ! o @', matches: (value: string) => /[\p{P}\p{S}]/u.test(value) },
];

export function validPassword(password: string): boolean {
  return PASSWORD_RULES.every(rule => rule.matches(password));
}
