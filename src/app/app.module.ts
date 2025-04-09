import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from "./core/services/data.services";
import { httpInterceptorProviders } from "./interceptor";
import { AdminModule } from './component/admin-page/admin.module';
import {CustomCurrencyPipe} from "./share/pipes/custom_currency_pipe";
import {CurrencyPipe} from "@angular/common";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {PixelModule} from "@felipeclopes/ngx-pixel";
import { HomePageModule } from './component/user-page/home-page/home-page.module';
import { UserPageModule } from './component/user-page/user-page.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ToastrModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UserPageModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    CarouselModule,
    AdminModule,
    PixelModule.forRoot({ enabled: true, pixelId: '1381905275860760' })

  ],
  providers: [DataService,
    httpInterceptorProviders,
    CustomCurrencyPipe,
    CurrencyPipe,
    provideAnimations(), // required animations providers
    provideToastr(),
    provideHttpClient(withFetch()),
    provideClientHydration(),
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
