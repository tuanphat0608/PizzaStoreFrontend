import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { ReviewAddOrEditComponent } from './components/review-add-or-edit/review-add-or-edit.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewRoutingModule } from './review-routing.module';

@NgModule({
  declarations: [ReviewListComponent, ReviewAddOrEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ReviewRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class ReviewModule { }
