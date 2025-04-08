import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';
import { OrderListComponent } from './components/order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    data: {
      pageTitle: 'Danh sach don hang',
    },
  },
  // {
  //   path: `${RouterConstants.ORDER_PAGE}/:id`,
  //   component: AddNewProductComponent,
  //   title: 'Chi tiet don hang',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
