import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from "ngx-editor";
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { FlashsaleRoutingModule } from './flashsale-routing.module';
import { AddOrEditFlashsaleComponent } from './components/add-or-edit-flashsale/add-or-edit-flashsale.component';
import { AssignProductComponent } from './components/assign-product/assign-product.component';
import { FlashsaleListComponent } from './components/flashsale-list/flashsale-list.component';

@NgModule({
  declarations: [FlashsaleListComponent, AddOrEditFlashsaleComponent , AssignProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    FlashsaleRoutingModule,
    CheckboxTreeComponent,
    NgxEditorModule,
    SharedDirectiveModule,
  ],
  providers: [],
})
export class FlashsaleModule { }
