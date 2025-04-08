import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BreadcrumbService} from './breadcrumb/breadcrumb.service';
import {CategoriesResponseData, CategoryService} from "../../share/services/category.service";
import {ICategory, INews, IProduct, IReview} from "../../model/model";
import {NewsResponseData, NewsService} from "../../share/services/news.service";
import {ReviewResponseData, ReviewService} from "../../share/services/review.service";

@Component({
  selector: 'dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss', '../../app.component.scss']
})
export class DashBoardComponent implements OnInit {
  isScrolled = false;
    categories: ICategory[];
  allCategories: ICategory[];
  searchCategories: ICategory[];
  constructor(private breadcrumbService: BreadcrumbService,
              private route: ActivatedRoute,
              private categoryService: CategoryService,
              private newsService: NewsService,
              private reviewService: ReviewService,
  )
{}
  ngOnInit(): void {

    this.categoryService.getSimpleCategories(0,20,'').subscribe((data: CategoriesResponseData) => {
      var catKhuyenMai = data.content.filter(c => c.id == '12');

      var catTinTuc = data.content.filter(c => c.id == '13');

      var catAll = data.content.filter(c => (c.id != '12' && c.id != '13'&& c.id != '0'));

      this.categories =[...catAll,...catKhuyenMai, ...catTinTuc]
      this.searchCategories = [...this.categories?.filter(tmp => tmp.is_show_in_dashboard).slice(0,3), ...catKhuyenMai, ...catTinTuc]

      // this.categories = data.content;
    });
    this.categoryService.getAllCategories().subscribe((data:CategoriesResponseData)=>{
      this.allCategories =  data.content;
    })
    this.breadcrumbService.setBreadcrumbs([]);
  }
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.scrollY > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

}

