import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BASE_URL } from './base-url-interceptor';
import { TokenService } from '../auth';
import { environment } from 'src/environments/environment';
import { User } from "../component/admin-page/login/user.model";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private hasHttpScheme = (url: string) => new RegExp('^http(s)?://', 'i').test(url);

  constructor(
    private tokenService: TokenService,
    private router: Router,
    @Optional() @Inject(BASE_URL) private baseUrl?: string
  ) {
  }

  allowApiKey: string[] = [
    '/api/v1/orders',
    '/api/v1/auth'
  ]

  //   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //     var matcher = new AntPathMatcher();

  //     const handler = () => {

  //     };
  //     const userData: {
  //       email: string;
  //       id: string;
  //       _token: string;
  //       _tokenExpirationDate: string;
  //     } = JSON.parse(localStorage.getItem('userData'));
  //     var user;
  //     if(request.method != 'POST' && this.allowApiKey.includes(request.url)){
  //       return next
  //         .handle(
  //           request.clone({
  //             headers: request.headers.append(`${environment.apiKeyType}`, environment.apiKey),
  //             withCredentials: true,
  //           })
  //         )
  //         .pipe(
  //           catchError((error: HttpErrorResponse) => {
  //             if (error.status === 401) {
  // //handle 401
  //             }
  //             // this.router.navigateByUrl(`/${CoreUrl.DASHBOARD}`)
  //             return throwError(() => error);
  //           }),
  //           tap(() => handler())
  //         );
  //     }

  //     if (request.method != 'GET' && userData) {
  //       user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
  //       if (user) {
  //         if (!user.token) {
  //           localStorage.removeItem('userData')
  //           this.router.navigateByUrl(`${RouterConstants.ADMIN}/${CoreUrl.LOGIN}`)
  //           return throwError(() => 'Token Expired');
  //         }
  //       }
  //       if (user && user.token) {
  //         return next
  //           .handle(
  //             request.clone({
  //               headers: request.headers.append(`${environment.authType}`, 'Bearer ' + user.token),
  //               withCredentials: true,
  //             })
  //           )
  //           .pipe(
  //             catchError((error: HttpErrorResponse) => {
  //               if (error.status === 401) {
  //                 //handle 401
  //               }
  //               // this.router.navigateByUrl(`/${CoreUrl.DASHBOARD}`)
  //               return throwError(() => error);
  //             }),
  //             tap(() => handler())
  //           );
  //       }
  //     } else {
  //       return next
  //         .handle(
  //           request.clone({
  //             headers: request.headers.append(`${environment.apiKeyType}`, environment.apiKey),
  //             withCredentials: true,
  //           })
  //         )
  //         .pipe(
  //           catchError((error: HttpErrorResponse) => {
  //             if (error.status === 401) {
  // //handle 401
  //             }
  //             // this.router.navigateByUrl(`/${CoreUrl.DASHBOARD}`)
  //             return throwError(() => error);
  //           }),
  //           tap(() => handler())
  //         );
  //     }



  //     return next.handle(request).pipe(
  //       tap(() => handler()));
  //   }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const handler = () => { };

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const user = userData && userData._token
      ? new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
      : null;

    const isExcluded =
      (request.method === 'POST' && request.url.endsWith('/orders')) ||
      (request.method === 'GET' && request.url.endsWith('/drinks')) ||
      (request.method === 'GET' && request.url.endsWith('/pizzas'));

    if (!isExcluded && user?.token) {
      // Inject Authorization header
      request = request.clone({
        headers: request.headers.set(`${environment.authType}`, `Bearer ${user.token}`),
        withCredentials: true,
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Optionally handle 401 (unauthorized)
        }
        return throwError(() => error);
      }),
      tap(() => handler())
    );
  }


  private shouldAppendToken(url: string) {
    return !this.hasHttpScheme(url) || this.includeBaseUrl(url);
  }

  private includeBaseUrl(url: string) {
    if (!this.baseUrl) {
      return false;
    }

    const baseUrl = this.baseUrl.replace(/\/$/, '');

    return new RegExp(`^${baseUrl}`, 'i').test(url);
  }
}
