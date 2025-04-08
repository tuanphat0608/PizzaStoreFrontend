import { ViewportScroller } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/model/model';
import Utils from 'src/app/share/utils/utils';

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.scss']
})
export class RelatedProductComponent {
  @Input() products?: IProduct[];
  @Input() isWhiteBG: any = false;
  @Input() isHidingLogo: any = false;
  @Input() isShadow: any = true;
  randomPrNumberSold: number;

  randomProgressValue : number;
  randomProgressText : string;
  constructor(private router: Router,private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.randomPrNumberSold = this.getRandomNumber(70, 350);

  }
   
    getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
}
