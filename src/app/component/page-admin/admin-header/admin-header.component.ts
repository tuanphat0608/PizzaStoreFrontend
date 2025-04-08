import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../login/auth.service";
import { RouterConstants } from "../../../share/router-constants";
import { PermisisonService } from 'src/app/share/services/permisison.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  isTokenAvalible: boolean
  userName: any;
  isShow: any;
  isShowUserInfo: any;
  animated = false;
  role : string= '';
  constructor(private router: Router, private authService: AuthService, private permission: PermisisonService, private localStorageService: LocalStorageService,    private toastr: ToastrService,
    ) {
    this.userName = 'Mi3s'
    this.isShow = false;
    this.isShowUserInfo = false;
  }
  ngOnInit(): void {
    this.authService.userRole.subscribe(role=>{
      this.role = role
      if(!role){
        this.role = this.localStorageService.get('role');

      }
    })
    const isAuth = JSON.parse(localStorage.getItem('userData'));
    this.permission.checkToken(isAuth?._token).subscribe(data=>{
      this.isTokenAvalible = data
    });
  }


  newPostClick() {
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN,RouterConstants.NEW_PRODUCT])
    // this.router.navigate([{ outlets: { outletAdmin: [RouterConstants.ADMIN_DASHBOARD]}}])
  }

  logoutClick() {
    this.isShow = false;
    this.authService.logout();
    this.localStorageService.remove('role')
    // this.loading = false;
    // this.router.navigate([{ outlets: { outletAdmin: [ RouterConstants.LOGIN] }}])\
    this.toastr.success('Đã đăng xuất');

  }

  humbergerClick() {
    this.animated = !this.animated;
  }

  protected readonly RouterConstants = RouterConstants;
  active: number = 0;

  productsClick() {
    this.active = 0;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.PRODUCT_PAGE])
  }

  postsClick() {
    this.active = 1;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.POST_PAGE])
  }

  categorysClick() {
    this.active = 2;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.CATE_PAGE])
  }

  orderListClick() {
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.ORDER_PAGE])
  }

  brandClick() {
    this.active = 3;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.BRAND_PAGE])
  }

  flashsaleClick() {
    this.active = 4;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.FLASHSALE_PAGE])
  }

  reviewClick() {
    this.active = 5;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.REVIEW_PAGE])
  }

  questionClick() {
    this.active = 6;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.QUESTION_PAGE])
  }

  userClick() {
    this.active = 7;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.USER_PAGE])
  }
  settingClick() {
    this.active = 8;
    this.isShow = false;
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.SETTING_PAGE])
  }
}
