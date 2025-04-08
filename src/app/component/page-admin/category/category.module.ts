import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { CategoryRoutingModule } from './category-routing.module';
import { AddOrEditCategoryComponent } from './components/add-or-edit-category/add-or-edit-category.component';
import { AssignProductComponent } from './components/assign-product/assign-product.component';
import { CategoryListComponent } from './components/category-list/category-list.component';

@NgModule({
  declarations: [CategoryListComponent, AddOrEditCategoryComponent , AssignProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    CategoryRoutingModule,
    CheckboxTreeComponent,
    NgxEditorModule,
    SharedDirectiveModule,
  ],
  providers: [],
})
export class CategoryModule { }
