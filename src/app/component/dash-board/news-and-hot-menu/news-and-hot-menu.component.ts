import {Component, Input} from '@angular/core';
import {ICategory, INews} from "../../../model/model";
import {RouterConstants} from "../../../share/router-constants";
import {Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'app-news-and-hot-menu',
  templateUrl: './news-and-hot-menu.component.html',
  styleUrls: ['./news-and-hot-menu.component.scss']
})
export class NewsAndHotMenuComponent {

  constructor(private router: Router,
              private viewportScroller: ViewportScroller
  ) {
    // Constructor logic, if needed
  }
  @Input()
  newsList: INews[];
  @Input()
  popularCategories: ICategory[];

  onSelectCategory(cat: ICategory) {
    this.router.navigate(
      [Utils.removeAccentChar(cat.full_name.toLowerCase().replaceAll(" ", "-"))],
      {state: {category_id: cat.id}}
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onNewsClick(news: INews) {
    this.router
      .navigate(
        [
          RouterConstants.TIN_TUC,
          Utils.removeAccentChar(
            news.title.replaceAll(' ', '-').replaceAll('\n', '')
          ),
        ],
        { state: { news_id: news.id} }
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  onSeeMoreNewsClick() {
    this.router
      .navigate(
        [
          RouterConstants.TIN_TUC
        ]
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
}
