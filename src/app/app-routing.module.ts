import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { requiereSesion } from './acceso/requiere-sesion';

// Login abre primero; las páginas del paciente se cargan por separado y requieren sesión.
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'mis-citas',
    canActivate: [requiereSesion],
    loadChildren: () => import('./mis-citas/mis-citas.module').then(m => m.MisCitasPageModule),
  },
  {
    path: 'reservar-cita',
    canActivate: [requiereSesion],
    loadChildren: () => import('./reservar-cita/reservar-cita.module').then(m => m.ReservarCitaPageModule),
  },
  {
    path: 'perfil',
    canActivate: [requiereSesion],
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule),
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  // Precarga los módulos de las demás páginas después de la navegación inicial.
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
