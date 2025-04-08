import {ViewportScroller, Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';
import * as moment from 'moment';
import {forkJoin} from 'rxjs';
import {ICategory, INews} from 'src/app/model/model';
import {CategoriesResponseData, CategoryService} from 'src/app/share/services/category.service';
import {NewsService, NewsResponseData} from 'src/app/share/services/news.service';
import {RouterConstants} from "../../../../share/router-constants";
import Utils from "../../../../share/utils/utils";

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.scss']
})
// export class ListNewsComponent implements OnInit{
export class ListNewsComponent implements OnInit{
  newsList: INews[];
  newsListMore: INews[][] = [];
  relatedNews: any[];
  categories: ICategory[];

  constructor(private router: Router,
              private location: Location,
              private newsService: NewsService,
              private viewportScroller: ViewportScroller,
              private categoryService: CategoryService
  ) {
    // this.category_id = this.router.getCurrentNavigation().extras.state['category_id'];
    let state = location.getState();
    // @ts-ignore
    var category_id = state?.['category_id'];
    if (!category_id && this.router.url == `/${RouterConstants.KHUYEN_MAI}`) {
      category_id = '12';
    }
    this.newsService.searchNews(0, 10, 'createdDate,desc', category_id).subscribe((data: NewsResponseData) => {
      this.newsList = data.content;
    })
    this.viewportScroller.scrollToPosition([0, 0]);

  }

  ngOnInit(): void {

    this.categoryService.getDashboardCategories().subscribe((data: CategoriesResponseData) => {
      this.categories = data.content;
      if (this.categories && this.categories.length >= 3) {
        const firstThreeIds = this.categories.slice(0, 3).map(item => item.id);
        const observables = firstThreeIds.map(category_id =>
          this.newsService.searchNews(0, 3, '', category_id)
        );
        forkJoin(observables).subscribe((newsResponses: NewsResponseData[]) => {
          newsResponses.forEach(data => {
            this.newsListMore.push(data?.content);
          });
          this.relatedNews = [].concat(...this.newsListMore)
        });
      } else {
      }
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  getCategoryList(): string[] {
    const categories = new Set<string>();
    if (this.categories && this.categories.length > 0) {
      this.categories.slice(0, 3).forEach(news => {
        if (news?.full_name) {
          categories.add(news.full_name);
        }
      });
      return Array.from(categories);
    } else {
      return [];
    }

  }

  getNewsByCategory(category: string): any[] {
    if (this.relatedNews && this.relatedNews.length > 0) {
      return this.relatedNews.filter(news => {
        return news.category && news.category.full_name && typeof news.category.full_name === 'string' && news.category.full_name === category;
      });
    } else {
      return [];
    }
  }

  protected readonly moment = moment;

  onNewsClick(news: INews) {
    this.router
      .navigate(
        [
          RouterConstants.DASH_BOARD,
          RouterConstants.TIN_TUC,
          Utils.removeAccentChar(
            news.title.replaceAll(' ', '-').replaceAll('\n', '')
          ),
        ],
        {state: {news_id: news.id}}
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
}
