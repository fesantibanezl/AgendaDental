import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from './sesion.service';

// Si no hay una sesión activa, devuelve al usuario a Login.
export const requiereSesion: CanActivateFn = () =>
  inject(SesionService).perfil() ? true : inject(Router).createUrlTree(['/login']);
