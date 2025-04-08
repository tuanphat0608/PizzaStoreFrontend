import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/product.model';
import {IImageInfo, IOrder, IProduct} from "../../../model/model";
import { BaseSearchModel } from '../common/models/base.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) { }

  getOrder(options: any, search?: string) {
    return this.http.get(
      `/api/v1/order`,
      {
        params: {
          page: options.page,
          size: options.size,
          name: search || ""
        }
      }
    );
  }
  getOrderById(item: any) {
    return this.http.get<IOrder>(
      `/api/v1/order/${item.id}`
    );
  }
  updateOrder(formData: any) {
    return this.http.put(`/api/v1/order/${formData.id}`, formData);
  }
  deleteOrder(ids: any[]) {
    return this.http.delete(`/api/v1/order`, { body: { ids } });
  }
  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put<String>(`/api/v1/order/$change-status`, payload);
  }



}
