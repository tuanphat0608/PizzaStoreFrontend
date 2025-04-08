import { Component, Input } from '@angular/core';
import { ICategory } from 'src/app/model/model';
import { CategoryService } from '../../page-admin/category/category.service';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';
import Utils from 'src/app/share/utils/utils';

@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.scss']
})
export class NavMobileComponent {
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private viewportScroller: ViewportScroller
  ) {
  }
  animated: any;
  @Input()
  categories: ICategory[] = [];

  humbergerClick() {
    this.animated = !this.animated;
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
