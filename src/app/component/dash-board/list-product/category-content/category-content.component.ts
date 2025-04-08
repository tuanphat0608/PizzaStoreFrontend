import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICategory, INews} from "../../../../model/model";
import {Editor, Toolbar} from "ngx-editor";
import {RouterConstants} from "../../../../share/router-constants";
import Utils from "../../../../share/utils/utils";
import {Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-category-content',
  templateUrl: './category-content.component.html',
  styleUrls: ['./category-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryContentComponent implements OnInit {
  dynamicHtmlContent: string;

  isExpand: boolean;
  @Input() category: ICategory;
  @Input() newsList: INews[];
  dummyNews: INews[] = []

  expandStyles = {
    height: 'auto',  // Apply styles when isExpand is true
    overflow: 'auto',
  };

  collapseStyles = {
    height: '1100px',
    overflow: 'hidden',
  };

  constructor(private router: Router,
              private viewportScroller: ViewportScroller,    private sanitizer: DomSanitizer
              ) {
  }
  ngOnInit(): void {
    this.dynamicHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.category?.content) as string;
  }

  expandOrCollapse() {
    this.isExpand = !this.isExpand;
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
}
