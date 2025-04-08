import { ViewportScroller } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from 'src/app/model/model';
import { RouterConstants } from 'src/app/share/router-constants';
import { CategoryService } from 'src/app/share/services/category.service';
import Utils from 'src/app/share/utils/utils';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.scss']
})
export class AllCategoryComponent {
@Input() allCategories: ICategory[]= []
constructor(
  private router: Router,
  private categoryService: CategoryService,
  private viewportScroller: ViewportScroller
) {
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
