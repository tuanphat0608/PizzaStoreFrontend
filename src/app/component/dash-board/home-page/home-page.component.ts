import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {isPlatformBrowser, ViewportScroller} from '@angular/common';
import {ICategory, INews, IProduct, IReview} from "../../../model/model";
import {CategoriesResponseData, CategoryService} from "../../../share/services/category.service";
import {ProductService} from "../../../share/services/product.service";
import {RouterConstants} from "../../../share/router-constants";
import {NewsResponseData, NewsService} from "../../../share/services/news.service";
import {ReviewResponseData, ReviewService} from "../../../share/services/review.service";
import {forkJoin} from "rxjs";
import * as moment from "moment/moment";
import {DomSanitizer} from "@angular/platform-browser";
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {
  categories: ICategory[];
  flashSaleProducts: IProduct[];
  EndDate: any;
  advertiseCategories: ICategory[];
  popularCategories: ICategory[];
  bestReview: IReview[];
  newsList: INews[];
  videoId: string = 'TFP4cMOR7Sg';
  // videoId: string = 'SKFG12uIkdQ';
  playerConfig = {
    controls: 1,
    mute: 0,
    autoplay: 0,
    disablekb: 1,
    rel: 0,
    loop: 1,
  };
  screenHeight: number;
  screenWidth: number;
  screenNewsWidth: number;
  firstNewsFirstSentence: string;
  isPhoneSm: boolean = false;

  constructor(private router: Router,
              private viewportScroller: ViewportScroller,
              private categoryService: CategoryService,
              private newsService: NewsService,
              private reviewService: ReviewService,
              private productService: ProductService,
              private sanitizer: DomSanitizer,
              @Inject(PLATFORM_ID) private platformId: Object

  ) {
    // Constructor logic, if needed
  }


  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {

    if (document.documentElement.clientWidth <= 575) {
      this.screenWidth = document.documentElement.clientWidth - 20;
    } else if (document.documentElement.clientWidth <= 768) {
      this.screenWidth = (document.documentElement.clientWidth) * 0.6 - 20
      this.screenNewsWidth = (document.documentElement.clientWidth) * 0.4 - 30
    } else {
      this.screenWidth = document.documentElement.clientWidth * 0.7 * 0.6
      this.screenNewsWidth = document.documentElement.clientWidth * 0.7 * 0.4 - 10
    }
    this.screenHeight = this.screenWidth * 1080 / 1920;
  }

  checkScreenSize(): void {
    this.isPhoneSm = window.innerWidth < 575;
    // Adjust the width as per your media query
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.checkScreenSize();
      }, 1000);

    } else {
      console.log('Running on the server');
    }
    this.categoryService.getDashboardCategories().subscribe((data: CategoriesResponseData) => {
      this.categories = data.content;
    });
    this.categoryService.getAdvertiseCategories().subscribe((data: CategoriesResponseData) => {
      this.advertiseCategories = data.content;
    });
    this.categoryService.getPopularCategories().subscribe((data: CategoriesResponseData) => {
      this.popularCategories = data.content;
    });
    this.newsService.searchNews(0, 4).subscribe((data: NewsResponseData) => {
      this.newsList = data.content;
    });
    this.reviewService.getDashboardReview().subscribe((data: ReviewResponseData) => {
      this.bestReview = data.content;
    });

    this.productService.getFlashSaleProduct().subscribe((data: any) => {
      this.flashSaleProducts = data?.listProducts ? data?.listProducts : [];
      this.EndDate = data?.endDate ? data?.endDate : [];
    })

  }

  seeMore(cat: ICategory) {
    this.router.navigate(
      [Utils.removeAccentChar(cat.full_name.toLowerCase())],
      {state: {category_id: cat.id}}
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  protected readonly moment = moment;

  onClickLatestNew(news: INews) {
    this.router
      .navigate(
        [
          RouterConstants.TIN_TUC,
          Utils.removeAccentChar(
            // news.title.replaceAll(' ', '-').replaceAll('\n', '')
            news.title
          ),
        ],
        {state: {news_id: news.id}}
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
}
