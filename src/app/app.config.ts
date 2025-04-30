import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { headerInterceptor } from './core/interceptors/headers/header.interceptor';
import { errorsInterceptor } from './core/interceptors/errors/errors.interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Create Function To Load Files from assets/i18n/

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');
}

// provide files to project




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor, errorsInterceptor, loadingInterceptor])),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule, TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    provideToastr()
  ]
};




