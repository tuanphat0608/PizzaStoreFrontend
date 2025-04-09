import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FoodOrder} from "../../../model/model";
import { OrderStatus } from 'src/app/core/common.enum';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) { }

  getOrderByStatus(options: any, status: OrderStatus) {
    return this.http.get<FoodOrder[]>(`/api/v1/orders`, {
      params: {
        page: options.page,
        size: options.size,
        status: status || OrderStatus.ALL
      }
    });
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${environment.apiKeyType} ${environment.apiKey}`
    });
    const params = new HttpParams().set('status', status);
    return this.http.post<any>(`/api/v1/orders/${orderId}`, null, { headers, params });
  }

  createOrder(order: FoodOrder) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${environment.apiKeyType} ${environment.apiKey}`
    });
    return this.http.post(`/api/v1/orders`, order, { headers });
  }

}
