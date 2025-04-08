import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashsaleListComponent } from './components/flashsale-list/flashsale-list.component';

const routes: Routes = [
  {
    path: '',
    component: FlashsaleListComponent,
    data: {
      pageTitle: 'Quản lí danh mục',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashsaleRoutingModule {}
