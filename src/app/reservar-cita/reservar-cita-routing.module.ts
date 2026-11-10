import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservarCitaPage } from './reservar-cita.page';

const routes: Routes = [
  {
    path: '',
    component: ReservarCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservarCitaPageRoutingModule {}
