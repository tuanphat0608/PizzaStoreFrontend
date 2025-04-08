import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { IOrder } from 'src/app/model/model';
import { CoreUrl } from 'src/app/share/constant/url.constant';
import { ProductResponseData } from 'src/app/share/services/product.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) { }
  getCustomerOrder(phoneNumber :string) {
    const params = new HttpParams()
    .set('page', '0')
    .set('size', '1')
    .set('sort', '')
    .set('phone', phoneNumber);
  return this.http
    .get<IOrder>(`${CoreUrl.API_PATH}/order`, {params: params})
    .pipe();
  }
}
