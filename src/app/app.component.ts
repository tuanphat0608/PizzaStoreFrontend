import { Component } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {RouterConstants} from "./share/router-constants";
import {create} from 'xmlbuilder2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mi3s';
}
