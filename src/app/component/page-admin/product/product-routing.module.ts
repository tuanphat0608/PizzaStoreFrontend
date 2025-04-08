import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    data: {
      pageTitle: 'Danh sach san pham',
    },
  },
  {
    path: RouterConstants.PRODUCT_CREATE,
    component: AddNewProductComponent,
    title: 'New Product - Mi3s',
  },
  {
    path: `${RouterConstants.PRODUCT_VIEW}/:id`,
    component: AddNewProductComponent,
    title: 'New Product - Mi3s',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
