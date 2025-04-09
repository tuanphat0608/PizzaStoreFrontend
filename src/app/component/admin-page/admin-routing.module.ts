import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/component/user-page/home-page/home-page.module').then(m => m.HomePageModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('src/app/component/admin-page/admin.module').then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
