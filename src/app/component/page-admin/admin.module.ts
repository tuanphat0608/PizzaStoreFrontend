import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminHeaderComponent} from './admin-header/admin-header.component';
import {AdminRoutingModule} from './admin-routing.module';
import {ConfirmDialogComponent} from './common/components/confirm-dialog/confirm-dialog.component';
import {LoadingIndicatorComponent} from './common/components/loading-indicator/loading-indicator.component';
import {LoginComponent} from './login/login.component';
import {MaterialModule} from './material.module';
import {QuickNewDialogComponent} from "./common/components/quick-add-dialog/confirm-dialog.component";
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MaterialModule
  ],
  declarations: [LoginComponent, AdminDashboardComponent, AdminHeaderComponent, LoadingIndicatorComponent, ConfirmDialogComponent, QuickNewDialogComponent,ChangePasswordComponent],
  exports: [LoginComponent, AdminDashboardComponent],
})
export class AdminModule {
}
