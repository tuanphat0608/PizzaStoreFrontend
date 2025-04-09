import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {MaterialModule} from './material.module';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MaterialModule
  ],
  declarations: [OrderComponent, LoginComponent],
  exports: [],
})
export class AdminModule {
}
