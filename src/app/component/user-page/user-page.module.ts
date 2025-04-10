import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageModule } from './home-page/home-page.module';
import { UserPageComponent } from './user-page.component';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    UserPageComponent
  ],
  imports: [
    CommonModule,
    HomePageModule,
    MaterialModule
  ],
  exports: [UserPageComponent]
})
export class UserPageModule { }
