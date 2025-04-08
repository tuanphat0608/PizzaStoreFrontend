import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {throwError, BehaviorSubject, map} from 'rxjs';
import {ICategory, IReview} from "../../model/model";
import {environment} from 'src/environments/environment';
import {CoreUrl} from "../constant/url.constant";

export interface ReviewResponseData {
  totalElements: number;
  totalPages: number;
  size: number,
  numberOfElements: number,
  content: IReview[]
}
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {}

  getDashboardReview() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000')
    return this.http
      .get<ReviewResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_REVIEW_DASHBOARD}`, {params: params })
      .pipe(
        catchError(this.handleError),
        tap(resData => {

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
