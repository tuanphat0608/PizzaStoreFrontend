import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageModule } from './home-page/home-page.module';
import { UserPageComponent } from './user-page.component';
import { QuantityDialogComponent } from './quantity-dialog/quantity-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    UserPageComponent,
    QuantityDialogComponent
  ],
  imports: [
    CommonModule,
    HomePageModule,
    MaterialModule
  ],
  exports: [UserPageComponent]
})
export class UserPageModule { }
