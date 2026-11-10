import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Usa el formato chileno en las fechas y el calendario.
registerLocaleData(localeEsCl);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-CL' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
