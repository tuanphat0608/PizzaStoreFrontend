import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Location, ViewportScroller} from "@angular/common";
import {CategoryService} from "../../../../share/services/category.service";
import {NewsResponseData, NewsService} from "../../../../share/services/news.service";
import {BreadcrumbService} from "../../breadcrumb/breadcrumb.service";
import {INews} from "../../../../model/model";
import * as moment from "moment";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {RouterConstants} from "../../../../share/router-constants";
import Utils from "../../../../share/utils/utils";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewsDetailComponent implements OnInit{
  newsId:string;
  news: INews;
  newsList: INews[];
  firstNewsFirstSentence : any;
  createdDate: string;
  dynamicHtmlContent: string;

  constructor(private router: Router,
              private location: Location,
              private newsService: NewsService,
              private viewportScroller: ViewportScroller,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private title:Title,
              private meta:Meta


  ) {
    // this.category_id = this.router.getCurrentNavigation().extras.state['category_id'];
    // let state = location.getState();
    // // @ts-ignore
    // this.newsId = state['news_id'];
    // if(!this.newsId){
    //   this.newsId = this.route.snapshot.paramMap.get('title');
    //   this.newsService.findNewsByTitle(this.newsId).subscribe((data: INews) => {
    //     this.news = data;
    //     this.createdDate = moment(this.news.created_date).format('dddd, DD MMMM yyyy, HH:mm')
    //     this.dynamicHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data?.content) as string;
    //   })
    // } else {
    //   this.newsService.getNews(this.newsId).subscribe((data: INews) => {
    //     this.news = data;
    //     this.createdDate = moment(this.news.created_date).format('dddd, DD MMMM yyyy, HH:mm')
    //     this.dynamicHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data?.content) as string;
    //   })
    // }



    this.viewportScroller.scrollToPosition([0, 0]);

  }
  ngOnInit(): void {
    const routerState = this.route.snapshot.url;
    console.log('routerState');
    console.log(routerState);
    this.route.params.subscribe((routerProperties: any) =>
      this.newsService.findNewsByTitle(routerProperties.title).subscribe((data: INews) => {
        this.news = data;
        this.title.setTitle(data.title);
        this.createdDate = moment(this.news.created_date).format('dddd, DD MMMM yyyy, HH:mm')
        this.dynamicHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data?.content) as string;

        this.sanitizer.bypassSecurityTrustHtml(data?.content)
        const parser = new DOMParser();
        const document = parser.parseFromString(data?.content, 'text/html');
        this.meta.addTag({ name: 'description', content: document.body.outerText.split('.')[0]})
      }));

    this.newsService.searchNews(0,10).subscribe((data: NewsResponseData) => {
      this.newsList = data.content;
      const parser = new DOMParser();
      this.sanitizer.bypassSecurityTrustHtml(data.content[0].content)
      const document = parser.parseFromString(data.content[0].content, 'text/html');
      this.firstNewsFirstSentence = document.body.outerText.split('.')[0];
    })
  }

  protected readonly moment = moment;

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
