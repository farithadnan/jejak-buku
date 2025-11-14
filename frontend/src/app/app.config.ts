import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Add this import
import { provideHttpClient } from '@angular/common/http';
import { BookService } from './shared/services/book.service';
import { MockBookService } from './shared/services/book.service.mock';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(),
    // Use MockBookService in demo mode, real BookService otherwise
    environment.useMockData
      ? { provide: BookService, useClass: MockBookService }
      : BookService
  ]
};
