import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TokenService } from '../../../auth';
import { RouterConstants } from '../../../share/router-constants';
import { User } from './user.model';
import { CORE_URL } from 'src/app/share/constant/api.constants';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  accessToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  public isAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
    public userRole: BehaviorSubject<string> = new BehaviorSubject<string>('');


  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}


  
  changePassword(email: string, oldPassword: string, newPassword:string) {
    return this.http
      .post<AuthResponseData>(
        '/api/v1/auth/$change-password',
        {
          username: email,
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        catchError(this.handleError),
        // map((token: any) => {
        //   if (token !== null) {
        //     const userSession = token.accessToken;
        //     if (token.accessToken == null && userSession) {
        //       token.accessToken = userSession.access_token;
        //       token.tokenType = userSession.token_type;
        //     }
        //   }
        //   return token;
        // },
        tap((resData) => {
          // this.tokenService.set(resData)
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
