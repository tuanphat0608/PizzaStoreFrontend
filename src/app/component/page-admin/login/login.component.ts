import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { finalize, Observable } from "rxjs";
import { RouterConstants } from 'src/app/share/router-constants';

import { LoadingService } from '../common/services/loading.service';
import { AuthResponseData, AuthService } from "./auth.service";
import { LocalStorageService } from 'src/app/share/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public isShowPassword: boolean = true;

  public email: string = '';
  public password: string = '';

  constructor(
    private authService: AuthService,
    private title: Title,
    private router: Router,
    private loader: LoadingService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    ) {
    this.title.setTitle('Login - Mi3s');
    localStorage.removeItem('userData');
    this.authService.isAuthenticated.next(false);
  }

  public loading = false;

  submitForm() {
    const loader = this.loader.show();
    this.loading = true;
    this.authService.login(this.email, this.password)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe(
        {
          next: resData => {
            if(resData.firstLogin){
              this.authService.isAuthenticated.next(false);
              this.router.navigate([RouterConstants.ADMIN, RouterConstants.CHANGE_PASSWORD])
              this.setForm();
              this.authService.getUserpermission().subscribe((res:any)=>{
                this.localStorageService.set('role', res.role);
                this.authService.userRole.next(res.role)
              })
            }else{
              this.setForm();
              this.authService.getUserpermission().subscribe((res:any)=>{
                this.localStorageService.set('role', res.role);
                this.authService.userRole.next(res.role)
                if(res.role != 'employee'){
                  this.router.navigate([RouterConstants.ADMIN, RouterConstants.PRODUCT_PAGE])

                }else{
                  this.router.navigate([RouterConstants.ADMIN, RouterConstants.ORDER_PAGE])
                }
              })
            }
            this.toastr.success('Đăng nhập thành công')
          },
          error: errorMessage => {
            this.setForm();
            this.toastr.error('Sai tài khoản hoặc mật khẩu')

          }
        }
      );

  }

  setForm() {
    this.email = '';
    this.password = '';
  }

}
