import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BaseUrlInterceptor } from './base-url-interceptor';
import { TokenInterceptor } from './token-interceptor';
import { ErrorHandleInterceptor } from './error-handle-interceptors';

export * from './base-url-interceptor';
export * from './token-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHandleInterceptor, multi: true }
];
