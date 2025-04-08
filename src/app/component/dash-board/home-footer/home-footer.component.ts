import {Component, Input} from '@angular/core';
import {IBestComment} from 'src/app/model/product';
import {RouterConstants} from "../../../share/router-constants";
import {Router} from "@angular/router";
import {CategoryService} from "../../../share/services/category.service";
import {ViewportScroller} from "@angular/common";
import { ICategory } from 'src/app/model/model';
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent {
  @Input() categories: ICategory[] = [];

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
  }
  onSelectCategory(cat: ICategory) {
    if(cat.id != "13")
    {
      this.router.navigate(
        [Utils.removeAccentChar(cat.full_name.toLowerCase().replaceAll(" ", "-"))],
        {state: {category_id: cat.id}}
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }else{
      this.router.navigate(
        [Utils.removeAccentChar(cat.full_name.toLowerCase().replaceAll(" ", "-"))],
        {state: {category_id: cat.id}}
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }

  }
  onMenuHeaderClick(id: number) {
    var routerArr: any[];
    switch (id) {

      case 11:
        routerArr = [ RouterConstants.CONTACT];
        break;
      case 12:
        routerArr = [ RouterConstants.WARRANTY_POLICY];
        break;
      case 13:
        routerArr = [ RouterConstants.GIOI_THIEU];
        break;
      case 14:
        routerArr = [ RouterConstants.DIEU_KHOAN];
        break;
      case 15:
        routerArr = [ RouterConstants.PHUONG_THUC_THANH_TOAN];
        break;
      case 16:
        routerArr = [ RouterConstants.QUY_DINH_VA_HUONG_DAN_MUA_HANG];
        break;
      case 17:
        routerArr = [ RouterConstants.CHINH_SACH_VAN_CHUYEN_KIEM_HANG];
        break;
      case 18:
        routerArr = [ RouterConstants.CHINH_SACH_DOI_TRA];
        break;
      case 20:
        routerArr = [ RouterConstants.CHINH_SACH_BAO_MAT_THONG_TIN];
        break;
    }
    //news contact id = 11
    this.router.navigate(
      routerArr,
      {state: {news_id: id}}
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
