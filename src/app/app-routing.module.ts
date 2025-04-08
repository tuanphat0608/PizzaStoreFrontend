import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from './share/router-constants';
import { ErrorPageComponent } from './component/dash-board/error-page/error-page.component';

const routes: Routes = [
  // {
  //   path: RouterConstants.DASH_BOARD, // Empty path for the default route
  //   component: DashBoardComponent,
  //   children: [
  //     {
  //       path: '', // Empty path for the default route inside DashBoardComponent
  //       component: HomePageComponent,
  //       data: { title: 'home-page' },
  //       pathMatch: 'full',
  //     },
  //   ],
  //   data: { title: 'Trang Chủ' },
  // },

  {
    path: RouterConstants.ADMIN,
    loadChildren: () =>
      import('./component/page-admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: RouterConstants.DASH_BOARD,
    loadChildren: () =>
      import('./component/dash-board/dashboard.module').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',onSameUrlNavigation: 'reload' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
