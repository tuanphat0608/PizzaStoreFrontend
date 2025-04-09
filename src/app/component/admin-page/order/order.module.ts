import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { MaterialModule } from "../material.module";
import { OrderAddOrEditComponent } from "./components/order-add-or-edit/order-add-or-edit.component";
import { OrderListComponent } from "./components/order-list/order-list.component";
import { OrderRoutingModule } from "./order-routing.module";
import { HomePageModule } from "../../user-page/home-page/home-page.module";

@NgModule({
  declarations: [OrderListComponent, OrderAddOrEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    OrderRoutingModule,
    HomePageModule,
  ],
})
export class OrderModule { }
