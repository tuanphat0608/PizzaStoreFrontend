import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandListComponent } from './components/brand-list/brand-list.component';

const routes: Routes = [
  {
    path: '',
    component: BrandListComponent,
    data: {
      pageTitle: 'Quản lí thương hiệu',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandRoutingModule {}
