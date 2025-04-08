import {Component, HostListener, Input} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {DashboardService} from "../../dash-broad.service";
import {RouterConstants} from "../../../../share/router-constants";
import {ICategory} from "../../../../model/model";
import {CategoriesResponseData, CategoryService} from "../../../../share/services/category.service";
import {ViewportScroller} from "@angular/common";
import Utils from "../../../../share/utils/utils";

@Component({
  selector: 'app-category-bar',
  templateUrl: './category-bar.component.html',
  styleUrls: ['./category-bar.component.scss']
})
export class CategoryBarComponent {
  @Input()
  isScrolled = false;
  @Input()
  categories: ICategory[] = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private viewportScroller: ViewportScroller
  ) {
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.scrollY > 0) {
      this.isScrolled = true;
    } else {
      // this.isScrolled = false;
    }
  }

  onSelectCategory(cat: ICategory) {
    if (cat.id == "13") {
      this.router.navigate(
        [RouterConstants.TIN_TUC]
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    } else if (cat.id == "12") {
      this.router.navigate(
        [RouterConstants.KHUYEN_MAI],
        {state: {category_id: cat.id}}
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    } else {
      this.router.navigate(
        [Utils.removeAccentChar(cat.full_name.toLowerCase().replaceAll(" ", "-"))],
        {state: {category_id: cat.id}}
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }

  }

}
