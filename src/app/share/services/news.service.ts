import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {throwError, BehaviorSubject, map} from 'rxjs';
import {ICategory, INews} from "../../model/model";
import {environment} from 'src/environments/environment';
import {CoreUrl} from "../constant/url.constant";
import { STATUS_ERROR_CODE } from 'src/app/interceptor/error-handle-interceptors';

export interface NewsResponseData {
  totalElements: number;
  totalPages: number;
  size: number,
  numberOfElements: number,
  content: INews[]
}
@Injectable({ providedIn: 'root' })
export class NewsService {
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  searchNews(page: number, size: number, sort:string = 'createdDate,desc', categoryId:string = '') {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('category_id', `${categoryId}`)
      .set('sort', sort);
    return this.http
      .get<NewsResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_News}`, {params: params })
      .pipe(
        catchError(this.handleError),
        tap(resData => {

        })
      );
  }
  getNews(id: string) {
    return this.http
      .get<INews>(`${CoreUrl.API_PATH}/${CoreUrl.API_News}/${id}`)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
        })
      );
  }
  findNewsByTitle(title: string) {
    const params = new HttpParams()
      .set('title', title);
    return this.http
      .get<INews>(`${CoreUrl.API_PATH}/${CoreUrl.API_News}/find`,{params:params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
        })
      );
  }
  getListNews(name : string = undefined) {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '3')
      .set('sort', '')
      .set('is_system', 'false')
      .set('name', name ? name : '')
      .set('isActive', 'true');
    return this.http
      .get<NewsResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_News}`, {params: params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {

        })
      );
  }
  private handleError(errorRes: HttpErrorResponse) {
    if ([STATUS_ERROR_CODE.NOT_FOUND, STATUS_ERROR_CODE.INTERAL_SERVER_ERROR].includes(errorRes.status)) {
      this.router.navigate(['/thong-bao/khong-tim-thay-trang']);
    }
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
