import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService} from '../breadcrumb/breadcrumb.service';
import {ProductResponseData, ProductService} from "../../../share/services/product.service";
import {CategoriesResponseData} from "../../../share/services/category.service";
import {IProduct} from "../../../model/model";
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: String;
  product: IProduct;
  productSuggest: any[];
  averageStar: number = 0
  value5Star: number = 0;
  value4Star: number = 0;
  value3Star: number = 0;
  value2Star: number = 0;
  value1Star: number = 0;
  salePercent: any;
  listImg: string[]= []
  constructor(private router: Router,
              private location: Location,
              private productService: ProductService,
              private breadcrumbService: BreadcrumbService,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    var name = this.route.snapshot.paramMap.get('name');
    this.productService.getProductByName(name).subscribe((product: IProduct) => {
      this.product = product;
      this.breadcrumbService.setBreadcrumbs(['Trang Chủ', this.product.categories?.[0]?.full_name,product.name]);
      this.productService.getProductSuggest(this.product.brand.name).subscribe((data: ProductResponseData) => {
        this.productSuggest = data.content;
      });

      const dataRating = this.product?.reviews;
      var totalPoint = 0
      if (dataRating) {
        dataRating.forEach(element => {
          totalPoint += element.rating_point;
          if (element.rating_point == 5) {
            this.value5Star++
          }
          if (element.rating_point == 4) {
            this.value4Star++
          }
          if (element.rating_point == 3) {
            this.value3Star++
          }
          if (element.rating_point == 2) {
            this.value2Star++
          }
          if (element.rating_point == 1) {
            this.value1Star++
          }
        });
      }
      const totalReviews = this.product?.reviews?.length
      this.averageStar = this.product?.reviews?.length ? Math.floor(totalPoint / totalReviews) : 0;
      this.salePercent = (1 - (this.product.price / this.product.listPrice)) * 100

    });

  }
}
