import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { SettingComponent } from './components/setting/setting.component';
import { SettingRouterModule } from './setting-router.module';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    CheckboxTreeComponent,
    SharedDirectiveModule,
    NgxEditorModule,
    SettingRouterModule
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
})
export class SettingModule { }
