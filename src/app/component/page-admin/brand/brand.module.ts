import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { BrandListComponent } from './components/brand-list/brand-list.component';
import { BrandRoutingModule } from './brand-routing.module';

@NgModule({
  declarations: [BrandListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    BrandRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class BrandModule { }
