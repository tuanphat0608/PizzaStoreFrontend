import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  constructor(private router: Router) {     this.errorStatus = localStorage.getItem('errorStatus');
}
  errorStatus : string = '';
  onButtonClick() {
    this.router.navigate(['/trang-chu']);
  }

}
