import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {throwError, BehaviorSubject, map} from 'rxjs';
import {ICategory, IProduct} from "../../model/model";
import {environment} from 'src/environments/environment';
import {CoreUrl} from "../constant/url.constant";
import { STATUS_ERROR_CODE } from 'src/app/interceptor/error-handle-interceptors';

export interface CategoriesResponseData {
  totalElements: number;
  totalPages: number;
  size: number,
  numberOfElements: number,
  content: ICategory[]
}
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router : Router) {}

  getSimpleCategories(page: number, size: number, sort:string) {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('isActive', `true`)
      .set('sort', sort);
    return this.http
      .get<CategoriesResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_SIMPLE_CATEGORY}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }
  getAdvertiseCategories() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000')
      .set('sort', '')
      .set('isActive', `true`)
      .set('isAdvertise', 'true')
    return this.http
      .get<CategoriesResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }
  getPopularCategories() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '20')
      .set('sort', 'createdDate,asc')
      .set('isActive', `true`)
      .set('isPopular', 'true')
    return this.http
      .get<CategoriesResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }
  getDashboardCategories() {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '20')
      .set('sort', '')
      .set('isShowInDashboard', 'true')
      .set('isActive', `true`)
      .set('isIncludeProduct', 'true');
    return this.http
      .get<CategoriesResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }
  getAllCategories() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '20')
      .set('isActive', `true`)
    return this.http
      .get<CategoriesResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }

  getDashboardv2Categories() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '20')
      .set('sort', '')
      .set('isActive', `true`)
      .set('isShowInDashboard', 'true')
      .set('isIncludeProduct', 'true');
    return this.http
      .get<ICategory[]>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY_DASHBOARD}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {

        })
      );
  }

  findCategory(name: string) {
    const params = new HttpParams()
      .set('name', name)
      .set('isActive', `true`);
    return this.http
      .get<ICategory>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY_FIND}`,{params:params})
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {
        })
      );
  }
  getProductsByCategory(category_id: string, page: number, size: number, sort:string = 'product.createdDate,desc',most_viewed : boolean ,most_sale : boolean, listbrand : string) {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sort', sort)
      .set('isActive', `true`)
      .set('most_viewed', most_viewed)
      .set('most_sale' , most_sale)
      .set('brand', listbrand);
    return this.http
      .get<ICategory>(`${CoreUrl.API_PATH}/${CoreUrl.API_CATEGORY}/${category_id}/${CoreUrl.PRODUCT}`, {params: params })
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(resData => {
        })
      );
  }


  private handleError(errorRes: HttpErrorResponse) {
    console.log('handleError')
    console.log(this)
    if ([STATUS_ERROR_CODE.NOT_FOUND, STATUS_ERROR_CODE.INTERAL_SERVER_ERROR, STATUS_ERROR_CODE.BAD_REQUEST, STATUS_ERROR_CODE.SERVICES_UNAVAILABLE].includes(errorRes.status)) {
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
