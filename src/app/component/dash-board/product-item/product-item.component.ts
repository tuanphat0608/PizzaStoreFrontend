import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Product} from "../../../model/product";
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import {IProduct} from "../../../model/model";
import {RouterConstants} from "../../../share/router-constants";
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductItemComponent implements OnInit{
  @Input() product: IProduct;
  @Input() isListProduct: boolean;
  @Input() isShadow: any = true;
  @Input() category:string;
  categoryName:string;
  randomPrNumberSold: number;
  constructor(private router: Router,private viewportScroller: ViewportScroller) {}
  ngOnInit(): void {
    this.randomPrNumberSold = this.getRandomNumber(70, 350);
  }

  getLabelUrl(): String {
    if(this.product?.label.toLowerCase() == "new")
      return "assets/icon/Untitled-1-03.png"
    if(this.product?.label.toLowerCase() == "sale")
      return "assets/icon/Untitled-1-02.png"
    if(this.product?.label.toLowerCase() == "hot")
      return "assets/icon/Untitled-1-01-1.png"
    return "assets/icon/Untitled-1-01-1.png"
  }
  getButtonIconUrl(): String {
    if(this.product?.label.toLowerCase() == "sale")
      return "assets/icon/coupon.png"

    return "assets/icon/express-delivery.png"
  }
  navigateToProductDetail( productName: String, productId: String) {
    if (this.product?.categories?.[0]?.name) {
      this.categoryName = this.product.categories[0].name
    } else {
      this.categoryName = this.category.replaceAll(" ","-").replaceAll("\n","");
    }
    this.router.navigate(
      [this.categoryName, Utils.removeAccentChar(productName.replaceAll(" ","-").replaceAll("\n",""))],
      { state: { product_id: productId } }
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getDisplayPrice(product: IProduct): number {
    if(product.price && product.price != 0) {
      return product.price;
    }
    if(product.price12 && product.price12 != 0) {
      return product.price12;
    }
    if(product.price18 && product.price18 != 0) {
      return product.price18;
    }
    return product.listPrice;
  }
}
