import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants } from '../../../share/router-constants';
import { DashboardService } from '../dash-broad.service';
import { ViewportScroller } from '@angular/common';
import { ICategory } from "../../../model/model";
import { CategoriesResponseData, CategoryService } from "../../../share/services/category.service";
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss', '../../../app.component.scss'],
})
export class HomeHeaderComponent implements OnInit {
  isScrolled = false;
  @Input()
  categories: ICategory[] = [];
@Input() allCategories : ICategory[]=[];
@Input() searchCategories : ICategory[]=[];
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private viewportScroller: ViewportScroller
  ) { }
  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.scrollY > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  onCartClick() {
    this.router.navigate([RouterConstants.SHOPPING_CART]).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onMenuHeaderClick(id: number) {
    var routerArr: any[];
    let params: any = {};
    switch (id) {
      case 0:
        routerArr = ["cua-hang"];
        params = { state: { category_id: 0 } }
        break;
      case 11:
        routerArr = [ RouterConstants.CONTACT];
        params = { state: { news_id: id } }
        break;
      case 12:
        routerArr = [ RouterConstants.WARRANTY_POLICY];
        params = { state: { news_id: id } }
        break;
      case 13:
        routerArr = [ RouterConstants.KIEM_TRA_DON_HANG];
        break;
      case 14:
        routerArr = [ RouterConstants.DA_XEM];
        break;
    }
    //news contact id = 11
    this.router.navigate(
      routerArr, params
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
