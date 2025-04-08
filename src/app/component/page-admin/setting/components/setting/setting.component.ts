import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../../common/services/loading.service';
import { SettingService } from '../../../../../share/services/setting.service';
import {IGenericProduct, IQuestion} from "../../../../../model/model";
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-question-list',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  form: FormGroup;
  get imageInfo() {
    return this.form?.get('banner_image')?.value?.path;
  }
  get imageInfoMobile() {
    return this.form?.get('banner_image_mobile')?.value?.path;
  }
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private settingService: SettingService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService
  ) {
    this.onBuildForm();

  }

  onBuildForm() {
    this.form = this.fb.group({
      banner_image: this.fb.control(null),
      banner_image_mobile: this.fb.control(null),
      url_banner: this.fb.control(null),
      url_video: this.fb.control(null),
    });
  }

  ngOnInit() {
    this.settingService.getSetting().subscribe(res => {
      this.form.patchValue(res);
    })
  }

  uploadAvatar(event: any) {
    const files = event?.target?.files;
    if (files && files[0]) {
      const file = files[0];
      const loader = this.loader.show();

      this.settingService.uploadImage(file)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          this.form?.get('banner_image')?.setValue(res[0]);
        });
    }
  }
  uploadAvatarMobile(event: any) {
    const files = event?.target?.files;
    if (files && files[0]) {
      const file = files[0];
      const loader = this.loader.show();
      this.settingService.uploadImage(file)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          this.form?.get('banner_image_mobile')?.setValue(res[0]);
        });
    }
  }

  onSave() {
    const loader = this.loader.show();
    this.settingService.updateSetting({ ...this.form.value})
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe(res => {
        this.toastr.success('Cập nhật cài đặt thành công')
      });
  }
}
