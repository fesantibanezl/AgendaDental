# AgendaDental

App de reservas de una clínica dental para Programación de
Aplicaciones Móviles, Semana 3. Usa la misma base de dependencias que
SkeletonAPP: Angular 21.2, Ionic Angular 9 y Angular Material 21.2.

## Ejecutar

Desde la raíz de AgendaDental, en PowerShell:

```powershell
npm.cmd ci
ionic.cmd serve --host=127.0.0.1 --port=8101 --no-open
```

Abre http://127.0.0.1:8101/. Para ver Ionic Lab, mantén la app corriendo y
ejecuta `npm.cmd run lab` en otra terminal; el visor queda en
http://127.0.0.1:8201/.

## Páginas

| Ruta | Pantalla |
| --- | --- |
| `/login` | Acceso con usuario y contraseña, con enlace para crear una cuenta. |
| `/registro` | Creación de cuenta y validación visible de usuario y contraseña. |
| `/mis-citas` | Lista de citas del paciente; detalle y cancelación en un modal. |
| `/reservar-cita` | Selección de prestación, profesional, fecha y hora, y guardado de la cita. |
| `/perfil` | Edición del nombre, apellido y correo de la cuenta activa. |

Las cinco páginas usan NgModules y se cargan mediante `loadChildren`. El
enrutador redirige la raíz a Login y mantiene `PreloadAllModules`.

Para probar el acceso, ingresa con el usuario `Dental07` y la contraseña
`Turno2026!`. La app crea esa cuenta ficticia en el primer ingreso, sin pasar por
**Crear cuenta**. Si ya registraste `Dental07` en ese navegador, ingresa con la
contraseña que elegiste al registrarlo.

El navegador guarda un verificador PBKDF2 para cada cuenta. La sesión se conserva
al recargar la pestaña y se borra al pulsar **Cerrar sesión**. El prototipo no usa
SQL ni autentica pacientes reales.

## Recorrido de prueba

1. Ingresa, abre **Reservar cita** y elige una prestación y un profesional.
2. Abre el calendario de Angular Material. Elige hoy o un día futuro y luego
   un bloque disponible de 30 minutos, de 09:00 a 17:30 (cierre a las 18:00).
3. Pulsa **Reservar**. La cita aparece como **Confirmada** en **Mis citas**.
   Cada paciente puede tener solo una cita confirmada por profesional y día.
   Ábrela para ver el detalle o cancelarla. Una cancelación libera el bloque y
   permite volver a reservar con ese profesional en esa fecha.
4. En **Perfil**, cambia el nombre para ver la interpolación en el saludo.
   Pulsa **Restablecer** para recuperar los valores guardados o **Guardar** para
   actualizar el perfil. Vuelve a **Mis citas** para comprobar el saludo.

Las citas y los cambios de perfil se conservan en el navegador. Solo se muestran
las citas de la cuenta activa. El saludo de **Mis citas** y el movimiento de
los campos al pulsar **Restablecer** en **Perfil** usan `AnimationController`
de Ionic; ambos respetan la preferencia de movimiento reducido.

## Evidencias

- [Generación de las páginas con Ionic CLI](evidencias/generacion-paginas.txt):
  comandos ejecutados y archivos que creó o actualizó cada uno.
- [Verificación de la base](evidencias/verificacion-base.txt):
  versiones, revisión de código y pruebas unitarias.
- [Compilación de la base](evidencias/compilacion-base.txt): salida de Angular CLI.
- [Navegación en el navegador](evidencias/navegacion-base.txt): comprobación del
  recorrido entre las cinco páginas y del modal de detalle.
- [Pruebas de la agenda](evidencias/verificacion-funcional.txt): revisión de código
  y pruebas de los límites de fecha y hora.
- [Prueba de reserva y perfil](evidencias/navegacion-funcional.txt): registro del
  recorrido completo, cancelación, edición de perfil y persistencia local.
