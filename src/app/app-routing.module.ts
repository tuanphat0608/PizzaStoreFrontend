import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from './share/router-constants';
import { HomePageComponent } from './component/user-page/home-page/home-page.component';
import { UserPageComponent } from './component/user-page/user-page.component';
import { AdminEntryComponent } from './component/admin-page/admin-entry/admin-entry.component';

const routes: Routes = [

  {
    path: RouterConstants.ADMIN,
    component: AdminEntryComponent
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
