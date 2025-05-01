import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimationsAsync(), 
    // {provide: LOCALE_ID, useValue: 'he-IL'},
    // { provide: MAT_DATE_LOCALE, useValue: 'he-IL' }
    // provideHttpClient(withInterceptors([AuthInterceptor])), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
