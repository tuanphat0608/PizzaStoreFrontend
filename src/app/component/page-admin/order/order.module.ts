import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';
import { MaterialModule } from '../material.module';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderRoutingModule } from './order-routing.module';
import {OrderAddOrEditComponent} from "./components/order-add-or-edit/order-add-or-edit.component";
import {DashboardModule} from "../../dash-board/dashboard.module";

@NgModule({
  declarations: [OrderListComponent, OrderAddOrEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    OrderRoutingModule,
    CheckboxTreeComponent,
    SharedDirectiveModule,
    DashboardModule,
  ],
})
export class OrderModule { }
