import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from './share/router-constants';
import { HomePageComponent } from './component/user-page/home-page/home-page.component';
import { UserPageComponent } from './component/user-page/user-page.component';

const routes: Routes = [

  {
    path: RouterConstants.ADMIN,
    loadChildren: () =>
      import('./component/admin-page/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: UserPageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',onSameUrlNavigation: 'reload' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
