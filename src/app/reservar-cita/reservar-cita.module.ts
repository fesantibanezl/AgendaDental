import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { IonicModule } from '@ionic/angular/lazy';

import { ReservarCitaPageRoutingModule } from './reservar-cita-routing.module';

import { ReservarCitaPage } from './reservar-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservarCitaPageRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  // Configura el calendario de Angular Material y sus etiquetas en español.
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MatDatepickerIntl,
      useFactory: () => Object.assign(new MatDatepickerIntl(), {
        calendarLabel: 'Calendario de citas',
        openCalendarLabel: 'Abrir calendario',
        closeCalendarLabel: 'Cerrar calendario',
        prevMonthLabel: 'Mes anterior',
        nextMonthLabel: 'Mes siguiente',
        prevYearLabel: 'Año anterior',
        nextYearLabel: 'Año siguiente',
        prevMultiYearLabel: 'Período anterior',
        nextMultiYearLabel: 'Período siguiente',
        switchToMonthViewLabel: 'Elegir día',
        switchToMultiYearViewLabel: 'Elegir año y mes',
      }),
    },
  ],
  declarations: [ReservarCitaPage]
})
export class ReservarCitaPageModule {}
