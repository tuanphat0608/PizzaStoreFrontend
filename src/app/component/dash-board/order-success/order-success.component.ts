import { Location, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';
import { ICategory, IOrder, IOrderDetail } from "../../../model/model";
import { CustomCurrencyPipe } from "../../../share/pipes/custom_currency_pipe";
import * as moment from "moment";

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent {
  order: IOrder;
  totalPrice: number = 0;
  isReciveAtHome: boolean;
  isPayThroughBank: boolean;
  isPayByMomo: boolean;
  isOnlinePay: boolean;
  advertiseCategories: ICategory[];
  constructor(
    private router: Router,
    private location: Location,
    private viewportScroller: ViewportScroller
  ) {
    let state = location.getState();
    // @ts-ignore
    this.order = state['order'];
    this.advertiseCategories = JSON.parse(localStorage.getItem('advertiseCategories'));
    if (this.order.product_order_list) {
      for (let orderdetail of this.order.product_order_list) {
        let selectedPrice: number = orderdetail.product.listPrice;
        switch (orderdetail.warranty_type) {
          case 1: {
            if (orderdetail.product.price && orderdetail.product.price != 0)
              selectedPrice = orderdetail.product.price
            break;
          }
          case 12: {
            if (orderdetail.product.price12 && orderdetail.product.price12 != 0)
              selectedPrice = orderdetail.product.price12
            break;
          }
          case 18: {
            if (orderdetail.product.price18 && orderdetail.product.price18 != 0)
              selectedPrice = orderdetail.product.price18
            break;
          }
        }
        this.totalPrice += (selectedPrice * orderdetail.quantity);
      }
    }

    if (this.order?.payment_method == 'Chuyển khoản ngân hàng') {
      this.isReciveAtHome = false;
      this.isPayThroughBank = true;
      this.isPayByMomo = false;
      this.isOnlinePay = false;
    }
    if (this.order?.payment_method == 'Trả tiền mặt khi nhận hàng') {
      this.isReciveAtHome = true;
      this.isPayThroughBank = false;
      this.isPayByMomo = false;
      this.isOnlinePay = false;
    }
    if (this.order?.payment_method == 'Quét Mã MoMo') {
      this.isReciveAtHome = false;
      this.isPayThroughBank = false;
      this.isPayByMomo = true;
      this.isOnlinePay = false;
    }
  }

  goToHomePage() {
    this.router.navigate(
      [RouterConstants.DASH_BOARD]
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  protected readonly CustomCurrencyPipe = CustomCurrencyPipe;
  protected readonly moment = moment;

  getSelectedPrice(orderDetail: IOrderDetail): number {
    let selectedPrice: number = orderDetail.product.listPrice;
    switch (orderDetail.warranty_type) {
      case 1: {
        if (orderDetail.product.price && orderDetail.product.price != 0)
          return orderDetail.product.price
        break;
      }
      case 12: {
        if (orderDetail.product.price12 && orderDetail.product.price12 != 0)
          return orderDetail.product.price12
        break;
      }
      case 18: {
        if (orderDetail.product.price18 && orderDetail.product.price18 != 0)
          return orderDetail.product.price18
        break;
      }
    }
    return selectedPrice;
  }
}
