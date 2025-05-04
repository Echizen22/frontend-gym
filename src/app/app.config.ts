import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PrimeNGConfig } from 'primeng/api';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    CookieService,
    provideAnimations(),
    {
      provide: PrimeNGConfig,
      useFactory: () => {
        const config = new PrimeNGConfig();
        config.setTranslation({
          startsWith: 'Empieza por',
          contains: 'Contiene',
          notContains: 'No contiene',
          endsWith: 'Termina en',
          equals: 'Igual a',
          notEquals: 'Distinto de',
          noFilter: 'Sin filtro',
          lt: 'Menor que',
          lte: 'Menor o igual',
          gt: 'Mayor que',
          gte: 'Mayor o igual',
          is: 'Es',
          isNot: 'No es',
          before: 'Antes de',
          after: 'Después de',
          clear: 'Limpiar',
          apply: 'Aplicar',
          matchAll: 'Coincide con todo',
          matchAny: 'Coincide con alguno',
          addRule: 'Agregar condición',
          removeRule: 'Eliminar condición',
          dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
          dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
          monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
          monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
          today: 'Hoy',
        });
        return config;
      }
    }
  ]

};
