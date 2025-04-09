import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {MaterialModule} from './material.module';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

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
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
   ],
  
})
export class AdminModule {
}
