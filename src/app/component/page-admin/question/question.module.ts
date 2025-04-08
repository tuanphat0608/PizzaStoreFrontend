import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { QuestionAddOrEditComponent } from './components/question-add-or-edit/question-add-or-edit.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionRoutingModule } from './question-routing.module';
import { GetProductComponent } from './components/get-product/get-product.component';

@NgModule({
  declarations: [QuestionListComponent, QuestionAddOrEditComponent, GetProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    QuestionRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class QuestionModule { }
