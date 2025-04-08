import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { PostAddOrEditComponent } from './components/post-add-or-edit/post-add-or-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostRoutingModule } from './post-routing.module';

@NgModule({
  declarations: [PostListComponent, PostAddOrEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    PostRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class PostModule { }
