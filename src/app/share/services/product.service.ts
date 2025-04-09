import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, take, tap} from 'rxjs/operators';
import {throwError, BehaviorSubject, map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CoreUrl} from "../constant/url.constant";
import { STATUS_ERROR_CODE } from 'src/app/interceptor/error-handle-interceptors';


@Injectable({providedIn: 'root'})
export class ProductService {
  private tokenExpirationTimer: any;
  private uniqueValuesSet = new Set<string>();
  constructor(private http: HttpClient,private router: Router) {
  }

  getPizzas(options: any) {
    return this.http.get(
      `/api/v1/pizzas`,
      {
        params: {
          page: options.page,
          size: options.size,
        }
      }
    );
  }

  getDrinks(options: any) {
    return this.http.get(
      `/api/v1/drinks`,
      {
        params: {
          page: options.page,
          size: options.size,
        }
      }
    );
  }
  

}
