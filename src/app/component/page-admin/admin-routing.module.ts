import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './common/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const rotues: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: RouterConstants.LOGIN,
        component: LoginComponent,
        title: 'Login - Mi3s'
      },
      {
        path: RouterConstants.CHANGE_PASSWORD,
        component: ChangePasswordComponent,
        title: 'Login - Mi3s'
      },
      {
        path: RouterConstants.ORDER_PAGE,
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
        canActivate: [AuthGuard],
        title: 'Đơn hàng',
        data: { requiredRoles: ['admin', 'employee', 'manager'] }, 
      },
      {
        path: RouterConstants.PRODUCT_PAGE,
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
        canActivate: [AuthGuard],
        title: 'Sản phẩm',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.POST_PAGE,
        loadChildren: () =>
          import('./post/post.module').then((m) => m.PostModule),
        canActivate: [AuthGuard],
        title: 'Tin tức',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.CATE_PAGE,
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
        canActivate: [AuthGuard],
        title: 'Danh mục',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.BRAND_PAGE,
        loadChildren: () =>
          import('./brand/brand.module').then((m) => m.BrandModule),
        canActivate: [AuthGuard],
        title: 'Hãng',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.FLASHSALE_PAGE,
        loadChildren: () =>
          import('./flashsale/flashsale.module').then((m) => m.FlashsaleModule),
        canActivate: [AuthGuard],
        title: 'Sự kiện',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.REVIEW_PAGE,
        loadChildren: () =>
          import('./review/review.module').then((m) => m.ReviewModule),
        canActivate: [AuthGuard],
        title: 'Đánh giá sản phẩm',
        data: { requiredRoles: ['admin','manager'] },
      },
      {
        path: RouterConstants.QUESTION_PAGE,
        loadChildren: () =>
          import('./question/question.module').then((m) => m.QuestionModule),
        canActivate: [AuthGuard],
        title: 'Câu hỏi',
        data: { requiredRoles: ['admin','manager'] },
      },
      {
        path: RouterConstants.SETTING_PAGE,
        loadChildren: () =>
          import('./setting/setting.module').then((m) => m.SettingModule),
        canActivate: [AuthGuard],
        title: 'Cài đặt',
        data: { requiredRoles: ['admin', 'editor', 'manager'] },
      },
      {
        path: RouterConstants.USER_PAGE,
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
        title: 'Tài khoản',
        data: { requiredRoles: ['admin'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rotues)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
