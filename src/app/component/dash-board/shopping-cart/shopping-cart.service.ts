import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ICategory, ICustomer, IOrder, IOrderDetail} from "../../../model/model";
import {PixelService} from "@felipeclopes/ngx-pixel";

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private http: HttpClient, private pixel: PixelService) { }

  createOrder(data: IOrder) {
    return this.http.post<IOrder>(`/api/v1/order`, data);
  }


}
