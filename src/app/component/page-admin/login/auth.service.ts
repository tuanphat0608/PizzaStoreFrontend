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
  [x: string]: any;
  kind: string;
  idToken: string;
  accessToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  firstLogin? :boolean
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

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDb0xTaRAoxyCgvaDF3kk5VYOsTwB_3o7Y',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(email, email, resData.accessToken);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        '/api/v1/auth/login',
        {
          username: email,
          password: password,
          returnSecureToken: true,
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
          this.handleAuthentication(email, email, resData.accessToken);
        })
      );
  }
  getUserpermission(){
    return this.http.post(`${CORE_URL}/auth/me`,null);
  }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.LOGIN]);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.isAuthenticated.next(false);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string) {
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuthenticated.next(true);
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
