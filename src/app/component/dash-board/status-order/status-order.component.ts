import { Component, HostListener, OnInit } from '@angular/core';
import {ICategory, IOrder} from "../../../model/model";
import { OrderService } from './status-order-service';

@Component({
  selector: 'app-status-order',
  templateUrl: './status-order.component.html',
  styleUrls: ['./status-order.component.scss']
})
export class StatusOrderComponent implements OnInit{
  screenWidth: number ;
  screenHeight: number ;
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    var width = document.documentElement.clientWidth;
    this.screenWidth = width - (0.3 * width);
    this.screenHeight = this.screenWidth * 750 / 1920;
  }
  orderCustomer : any
  totalPrice: number = 0;

  advertiseCategories:ICategory[];
  inputPhone : string;
  lat = 51.678418;
  lng = 7.809007;
  constructor(   private orderService :OrderService,
    ) {
    this.advertiseCategories = JSON.parse(localStorage.getItem('advertiseCategories'));
  }
  ngOnInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
  center: google.maps.LatLngLiteral = {lat: 10.8019025, lng: 106.6388115};
  zoom = 15;
  display: google.maps.LatLngLiteral;
  markers: any = [{
    position: {
      lat: 10.8019025,
      lng: 106.6388115,
    },
    label: {
      text: 'Mi'
    },
    title: 'Mi3s VietNam'
  }];

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }
  
  findOrder(){
    this.orderService.getCustomerOrder(this.inputPhone).subscribe((data : IOrder)=>{
      this.orderCustomer =data;
    })
  }
  getStatus(status: String) : String{
    var rs = "unknow";
    switch (status) {
      case "CREATED":
        return "Đơn hàng đã được tạo"
      case "CONFIRMED":
        return "Đơn hàng đã được xác nhận"
      case "SHIPPING":
        return "Đơn hàng đang vận chuyển"
      case "SHIPPED":
        return "Đơn hàng đã được bàn giao đơn vị vận chuyển"
      case "DONE":
        return "Đơn hàng đã được hoàn thành"
      case "CANCELLED":
        return "Đơn hàng đã được huỷ"

    }
    return rs;
  }
}
