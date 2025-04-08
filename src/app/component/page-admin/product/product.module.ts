import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductRoutingModule } from './product-routing.module';
import { AssignProductComponent } from './components/assign-product/assign-product.component';

@NgModule({
  declarations: [ProductListComponent, AddNewProductComponent, AssignProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ProductRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
  ],
})
export class ProductModule { }
