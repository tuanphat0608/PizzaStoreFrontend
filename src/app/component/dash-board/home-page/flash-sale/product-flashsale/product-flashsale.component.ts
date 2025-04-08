import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IProduct} from "../../../../../model/model";
import Utils from 'src/app/share/utils/utils';

@Component({
  selector: 'app-product-flashsale',
  templateUrl: './product-flashsale.component.html',
  styleUrls: ['./product-flashsale.component.scss']
})
export class ProductFlashsaleComponent implements OnInit {
  @Input() product: IProduct;
  @Input() category:string;
  @Input() isListProduct: boolean;
  @Input() isShadow: any = true;
  categoryName:string;
  randomProgressValue : number;
  randomProgressText : string;
  constructor(private router: Router,private viewportScroller: ViewportScroller) {}
  

  getLabelUrl(): String {
    if(this.product.label == "new")
      return "assets/icon/Untitled-1-03.png"
    if(this.product.label == "sale")
      return "assets/icon/Untitled-1-02.png"
    if(this.product.label == "hot")
      return "assets/icon/Untitled-1-01-1.png"
    return "assets/icon/Untitled-1-01-1.png"
  }
  getButtonIconUrl(): String {
    if(this.product.label == "sale")
      return "assets/icon/coupon.png"

    return "assets/icon/express-delivery.png"
  }
  navigateToProductDetail( product : IProduct) {
    const categoryName = product?.categories[0].name.replaceAll(" ","-").replaceAll("\n","");
    this.router.navigate(
      [categoryName, Utils.removeAccentChar(product?.name.replaceAll(" ","-").replaceAll("\n",""))],
      { state: { product_id: product?.id } }
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  getPercantageProgressBar(){
    const value =   (this.product.number_sold / this.product.stock) * 100;
    return value ;
  }
  ngOnInit(): void {
    this.randomProgressValue = this.getRandomNumber(40, 80);
    this.randomProgressText = 'Đã Bán ' + this.getRandomNumber(70, 350);
    }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
