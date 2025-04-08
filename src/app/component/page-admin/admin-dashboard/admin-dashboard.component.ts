import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay } from 'rxjs';

import { RouterConstants } from '../../../share/router-constants';
import { LoadingService } from '../common/services/loading.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  public isLoading: boolean = false;
  public loadingMessage: string = '';
  public isAuthenticated: Observable<boolean>;

  constructor(
    private router: Router,
    private loading: LoadingService,
    private authService: AuthService
  ) {
    let userData = localStorage.getItem('userData');
    if (!userData) {
      this.authService.isAuthenticated.next(false);
      router.navigate([RouterConstants.ADMIN, RouterConstants.LOGIN]);
    } else {
      this.authService.isAuthenticated.next(true);
      if (this.router.url == '/admin')
        router.navigate([RouterConstants.ADMIN, RouterConstants.PRODUCT_PAGE]);
    }
    this.loading.loadingSub.pipe(delay(0)).subscribe((loading) => {
      this.isLoading = loading;
    });

    this.loading.loadingMessage
      .pipe(delay(0))
      .subscribe((message) => (this.loadingMessage = message));
    this.isAuthenticated = this.authService.isAuthenticated.asObservable();
  }
}
