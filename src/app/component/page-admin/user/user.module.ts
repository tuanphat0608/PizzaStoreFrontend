import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import {  UserListComponent } from './components/user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserAddOrEditComponent } from './components/user-add-or-edit/user-add-or-edit.component';

@NgModule({
  declarations: [UserListComponent, UserAddOrEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    UserRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class UserModule { }
