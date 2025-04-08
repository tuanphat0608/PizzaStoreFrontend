import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Product} from 'src/app/model/product';
import {DashboardService} from '../dash-broad.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService} from '../breadcrumb/breadcrumb.service';
import {CategoryService} from "../../../share/services/category.service";
import {ICategory, INews, IProduct} from "../../../model/model";
import {NewsResponseData, NewsService} from "../../../share/services/news.service";
import { ViewportScroller } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListProductComponent implements OnInit {

  dummyProducts: IProduct[] = [];
  category: ICategory;
  category_id: string;
  newsList: INews[];
  page = 0;
  size = 5
  isNoMore = false;
  isLoading = false;
  specsValues:string[];
  isSeeMostCheck:boolean =false;
  isSaleMostCheck:boolean = false;
  constructor(private router: Router,
              private location: Location,
              private categoryService: CategoryService,
              private newsService: NewsService,
              private breadcrumbService: BreadcrumbService,
              private route: ActivatedRoute,
              private viewportScroller: ViewportScroller
  ) {
  }


  ngOnInit() {
    const routerState = this.route.snapshot.url;
    console.log('routerState');
    console.log(routerState);
    this.route.params.subscribe((routerProperties: any) =>
    {
      this.categoryService.findCategory(routerProperties.name).subscribe(category => {
        console.log('category')
        console.log(category)

        this.category_id = category.id;
        this.categoryService.getProductsByCategory(this.category_id, this.page, this.size, this.category_id == '0' ? 'createdDate,desc' : 'product.createdDate,desc',false,false,'').subscribe(tempCategory => {
          this.category = tempCategory;
          console.log('tempCategory')
          console.log(tempCategory)
          this.specsValues = this.getSpecsValues();
          this.breadcrumbService.setBreadcrumbs(['Trang Chủ', this.category.full_name]);
        })

        this.newsService.searchNews(0, 3, 'createdDate,desc', this.category_id).subscribe((data: NewsResponseData) => {
          this.newsList = data.content;
        });
        this.viewportScroller.scrollToPosition([0, 0]);
      })
    });
  }



  getSpecsValues() {
    const specsValues = this.category?.listBrands.map((product) => product.name);
    const uniqueProducts = new Set(specsValues);
    const uniqueProductsArray = Array.from(uniqueProducts);
    return uniqueProductsArray;
}


  seeMore() {
    this.isLoading = true;
    this.page += 1;
    this.categoryService.getProductsByCategory(this.category_id, this.page, this.size,this.category_id == '0' ? 'createdDate,desc' : 'product.createdDate,desc', false , false,'').subscribe(category => {
      if (category.listProducts.length > 0) {
        this.category.listProducts = this.category.listProducts.concat(category.listProducts);
      } else {
        this.isNoMore = true
      }
      this.isLoading = false;
    })
  }
  handleFilterChange(eventData: { saleMost: boolean, seeMost: boolean, selectedBrand: string }) {
    // this.category.listProducts = [];
    // this.categoryService.getProductsByCategory(this.category_id, this.page, this.size, '', eventData.seeMost, eventData.saleMost, eventData.selectedBrand ? eventData.selectedBrand : '')
    // .subscribe(category => {this.category = category});
  }
}
