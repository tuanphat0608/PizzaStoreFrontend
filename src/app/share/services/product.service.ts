import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, take, tap} from 'rxjs/operators';
import {throwError, BehaviorSubject, map, Observable} from 'rxjs';
import {ICategory, IImageInfo, IProduct} from "../../model/model";
import {environment} from 'src/environments/environment';
import {CoreUrl} from "../constant/url.constant";
import { STATUS_ERROR_CODE } from 'src/app/interceptor/error-handle-interceptors';

export interface ProductResponseData {
  totalElements: number;
  totalPages: number;
  size: number,
  numberOfElements: number,
  content: IProduct[]
}

@Injectable({providedIn: 'root'})
export class ProductService {
  private tokenExpirationTimer: any;
  private storageKey = 'seenProducts';
  private listSeenProduct = new BehaviorSubject<IProduct[]>(this.loadFromStorage());
  private stringSubject = new BehaviorSubject<string>('');
  string$ = this.stringSubject.asObservable();
  // Set to store unique values
  private uniqueValuesSet = new Set<string>();
  constructor(private http: HttpClient,private router: Router) {
  }

  getListSeen() {
    return this.listSeenProduct.asObservable();
  }

  addListSeen(item: IProduct) {
    const currentList = this.listSeenProduct.value;
    const updatedList = [...new Set([...currentList, item])];
    this.listSeenProduct.next(updatedList);
    this.saveToStorage(updatedList);
  }


  private loadFromStorage(): IProduct[] {
    const storedData = localStorage.getItem(this.storageKey);

    if (storedData) {
      return JSON.parse(storedData) as IProduct[];
    } else {
      return [];
    }
  }

  private saveToStorage(data: IProduct[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }


  postSendQuestion(idPoduct: string,data :any): Observable<any> {

    // Set headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${environment.apiKeyType} ${environment.apiKey}`
    });
    if(!data.is_active) data.is_active = false;
    return this.http.post<any>(`${CoreUrl.API_PATH}/${CoreUrl.PRODUCT}/${idPoduct}/question`, data, { headers: headers });
  }
  uploadImage(files: File[]) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    return this.http.post<IImageInfo[]>(`/api/v1/image/upload`, formData);
  }
  postReview(idPoduct: string,data :any): Observable<any> {

    // Set headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${environment.apiKeyType} ${environment.apiKey}`
    });
    return this.http.post<any>(`${CoreUrl.API_PATH}/${CoreUrl.PRODUCT}/${idPoduct}/review`, data, { headers: headers });
  }
  updateStringValue(newValue: string) {
    this.stringSubject.next(newValue);
  }
  getFlashSaleProduct() {

    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000')
      .set('sort', '')
      .set('isShowInDashboard', 'true')
      .set('isIncludeProduct', 'true');
    return this.http
      .get<ProductResponseData>(`${CoreUrl.API_PATH}/flash-sale/current-sale`, {params: params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {

        })
      );
  }

  getListProduct(name : string) {
    // let params = new URLSearchParams();
    // params.append("page", `${page}`)
    // params.append("size", `${size}`)
    // params.append("sort", sort)
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '10000')
      .set('sort', '')
      .set('name', name ? name : '')
      .set('isActive', 'true');
    return this.http
      .get<ProductResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.PRODUCT}`, {params: params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {

        })
      );
  }

  getProduct(productId: String) {
    return this.http
      .get<IProduct>(`${CoreUrl.API_PATH}/${CoreUrl.API_PRODUCT}/${productId}`)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
        })
      );
  }
  getProductByName(name: string) {
    const params = new HttpParams()
      .set('name', name);
    return this.http
      .get<IProduct>(`${CoreUrl.API_PATH}/${CoreUrl.API_PRODUCT_FIND}`,{params:params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
        })
      );
  }

  getProductSuggest(brandName: string) {
    const params = new HttpParams()
      .set('brandName', brandName)
    return this.http
      .get<ProductResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_PRODUCT}/${CoreUrl.SUGGEST}`, {params:params})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
        })
      );
  }

  searchProduct(page: number, size: number, sort:string = 'createdDate,desc') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
    return this.http
      .get<ProductResponseData>(`${CoreUrl.API_PATH}/${CoreUrl.API_PRODUCT}`, {params: params})
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
