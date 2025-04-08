import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {RouterModule, Routes} from '@angular/router';
import {RouterConstants} from 'src/app/share/router-constants';
import {LoadingScreenComponent} from "../../share/component/loading-screen/loading-screen.component";
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {DashBoardComponent} from './dash-board.component';
import {HomeFooterComponent} from './home-footer/home-footer.component';
import {CategoryBarComponent} from './home-header/category-bar/category-bar.component';
import {HomeHeaderComponent} from './home-header/home-header.component';
import {SearchBarComponent} from './home-header/search-bar/search-bar.component';
import {FlashSaleComponent} from './home-page/flash-sale/flash-sale.component';
import {ProductFlashsaleComponent} from './home-page/flash-sale/product-flashsale/product-flashsale.component';
import {HomePageComponent} from "./home-page/home-page.component";
import {CategoryContentComponent} from './list-product/category-content/category-content.component';
import {FilterProductComponent} from './list-product/filter-product/filter-product.component';
import {ListProductComponent} from './list-product/list-product.component';
import {NavMobileComponent} from './nav-mobile/nav-mobile.component';
import {NewsAndHotMenuComponent} from './news-and-hot-menu/news-and-hot-menu.component';
import {NewsDetailComponent} from './news/news-detail/news-detail.component';
import {ProductDetailBodyComponent} from './product-detail/product-detail-body/product-detail-body.component';
import {ProductRatingComponent} from './product-detail/product-detail-body/product-rating/product-rating.component';
import {
  StarRatingComponent
} from './product-detail/product-detail-body/product-rating/star-rating/star-rating.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductItemComponent} from './product-item/product-item.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {SlideProductComponent} from './slide-product/slide-product.component';
import {SliderBestCommentComponent} from './slider-best-comment/slider-best-comment.component';
import { SubmitReviewComponent } from './product-detail/product-detail-body/submit-review/submit-review.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ListNewsComponent } from './news/list-news/list-news.component';
import {CustomCurrencyPipe} from "../../share/pipes/custom_currency_pipe";
import { AutocompelteComponent } from './home-header/search-bar/autocompelte/autocompelte.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { StatusOrderComponent } from './status-order/status-order.component';
import { ListProductSeenComponent } from './list-product-seen/list-product-seen.component';
import {OrderSuccessComponent} from "./order-success/order-success.component";
import {GoogleMap, GoogleMapsModule} from "@angular/google-maps";
import { HomeHeaderBannerComponent } from './home-header-banner/home-header-banner.component';
import {YouTubePlayerModule} from "@angular/youtube-player";
import { ProgressbarComponent } from './home-page/flash-sale/progressbar/progressbar.component';
import {  CarouselModule as PrimeCarouselModule } from 'primeng/carousel';
import { CarouselModule as NgxBootstrapCarouselModule } from 'ngx-bootstrap/carousel';
import { ImagePreviewComponent } from './product-detail/product-detail-body/image-preview/image-preview.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AllCategoryComponent } from './home-header/search-bar/all-category/all-category.component';
import { ErrorPageComponent } from 'src/app/component/dash-board/error-page/error-page.component';
import { RelatedProductComponent } from './product-detail/product-detail-body/related-product/related-product.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashBoardComponent,
    data: {title: 'Trang Chủ'},
    children: [
      {
        path: '',
        component: HomePageComponent,
        data: {title: 'Trang Chủ'},
        pathMatch: 'full',
      },

      {
        path: RouterConstants.SHOPPING_CART,
        component: ShoppingCartComponent,
        data: {title: 'Thanh toán'},
      },
      {
        path: RouterConstants.CONTACT,
        component: NewsDetailComponent,
        data: {title: 'Liên  hệ hợp tác'},
      },
      {
        path: RouterConstants.WARRANTY_POLICY,
        component: NewsDetailComponent,
        data: {title: 'Chính sách bảo hành'},
      },
      {
        path: RouterConstants.GIOI_THIEU,
        component: NewsDetailComponent,
        data: {title: 'Giới thiệu'},
      },
      {
        path: RouterConstants.DIEU_KHOAN,
        component: NewsDetailComponent,
        data: {title: 'Điều khoản'},
      },
      {
        path: RouterConstants.PHUONG_THUC_THANH_TOAN,
        component: NewsDetailComponent,
        data: {title: 'Phương thức thanh toán'},
      },
      {
        path: RouterConstants.QUY_DINH_VA_HUONG_DAN_MUA_HANG,
        component: NewsDetailComponent,
        data: {title: 'Quy định và hướng dẫn mua hàng'},
      },
      {
        path: RouterConstants.CHINH_SACH_VAN_CHUYEN_KIEM_HANG,
        component: NewsDetailComponent,
        data: {title: 'Chính sách vận chuyển & kiểm hàng'},
      },
      {
        path: RouterConstants.CHINH_SACH_DOI_TRA,
        component: NewsDetailComponent,
        data: {title: 'Chính sách đổi trả'},
      },
      {
        path: RouterConstants.CHINH_SACH_BAO_MAT_THONG_TIN,
        component: NewsDetailComponent,
        data: {title: 'Chính sách bảo mật thông tin'},
      },
      {
        path: RouterConstants.TIN_TUC,
        component: ListNewsComponent,
        data: {title: 'Tin Tức'},
      },
      {
        path: RouterConstants.KHUYEN_MAI,
        component: ListNewsComponent,
        data: {title: 'Tin Tức'},
      },
      {
        path:`${RouterConstants.TIN_TUC}/:title`,
        component: NewsDetailComponent,
        data: {title: 'Tin Tức'},
      },
      {
        path: RouterConstants.KIEM_TRA_DON_HANG,
        component: StatusOrderComponent,
        data: {title: 'Kiểm tra đơn hàng'},
      },
      {
        path: `${RouterConstants.TIM_KIEM}/:search`,
        component: SearchProductComponent,
        data: {title: 'Tìm kiếm'},
      },
      {
        path: RouterConstants.DA_XEM,
        component: ListProductSeenComponent,
        data: {title: 'Đã xem'},
      },
      {
        path: `thong-bao/khong-tim-thay-trang`,
        component: ErrorPageComponent,
        data: {title: 'Lỗi'},
      },
      {
        path: `${RouterConstants.ORDER_RECEIVED}/:order_id`,
        component: OrderSuccessComponent,
        data: {title: 'Thanh toán'},
      },

      {
        path: `:category/:name`,
        component: ProductDetailComponent,
        data: {title: 'Chi tiết sản phẩm'},
      },
      {
        path: `:name`,
        component: ListProductComponent,
        data: {title: 'Danh Sách Sản Phẩm'},
      },

    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes),
    CommonModule,
    FormsModule,
    NgxBootstrapCarouselModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDialogModule,
    GoogleMapsModule,
    YouTubePlayerModule,
    MatToolbarModule,
    PrimeCarouselModule,
    
  ], // Include RouterModule here
  declarations: [
    OrderSuccessComponent,
    HomePageComponent,
    DashBoardComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    SearchBarComponent,
    CategoryBarComponent,
    NavMobileComponent,
    ProductItemComponent,
    ProductDetailBodyComponent,
    FlashSaleComponent,
    SlideProductComponent,
    BreadcrumbComponent,
    ListProductComponent,
    FilterProductComponent,
    CategoryContentComponent,
    SliderBestCommentComponent,
    NewsAndHotMenuComponent,
    ProductRatingComponent,
    ProductFlashsaleComponent,
    LoadingScreenComponent,
    StarRatingComponent,
    NewsDetailComponent,
    SubmitReviewComponent,
    CustomCurrencyPipe,
    ListNewsComponent,
    AutocompelteComponent,
    SearchProductComponent,
    StatusOrderComponent,
    ListProductSeenComponent,
    HomeHeaderBannerComponent,
    ProgressbarComponent,
    ImagePreviewComponent,
    AllCategoryComponent,
    ErrorPageComponent,
    RelatedProductComponent],
    
    exports: [
        HomePageComponent,
        DashBoardComponent,
        LoadingScreenComponent,
        CustomCurrencyPipe,
    ],
  providers:[
    CustomCurrencyPipe
  ]
})
export class DashboardModule {

}
