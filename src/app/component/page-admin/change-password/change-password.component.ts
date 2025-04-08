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
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePasswordComponent {

  public isOldShowPassword: boolean = true;
  public isNewShowPassword: boolean = true;
  public isReNewShowPassword: boolean = true;

  public newPassword: string = '';
  public oldPassword: string = '';
  public reNewPassword: string = '';
  constructor(
    private authService: AuthService, 
    private title: Title, 
    private router: Router, 
    private loader: LoadingService, 
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    ) {
    this.title.setTitle('Login - Mi3s');
    this.authService.isAuthenticated.next(false);
  }

  public loading = false;

  submitForm() {
    if(this.reNewPassword == this.reNewPassword){
      const loader = this.loader.show();
      this.loading = true;
      const username = this.localStorageService.get('userData')
      this.authService.changePassword(username.id,this.oldPassword,this.newPassword)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe(
          {
            next: resData => {
              this.authService.isAuthenticated.next(false);
              this.router.navigate([RouterConstants.ADMIN, RouterConstants.LOGIN])
              this.toastr.success('Thay đổi mật khẩu thành công');
            },
            error: errorMessage => {
              this.setForm();
            }
          }
        );
  
    }
   
  }

  setForm() {
    this.oldPassword = '';
    this.newPassword = '';
    this.reNewPassword = ''
  }

}
