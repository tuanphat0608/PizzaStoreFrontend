import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from "ngx-editor";
import { finalize } from 'rxjs';

import { CategoryService } from '../../../category/category.service';
import { LoadingService } from '../../../common/services/loading.service';
import { UserService } from '../../user.service';
import { CategoryModel } from '../../../common/models/category.model';

@Component({
  selector: 'app-post-add-or-edit',
  templateUrl: './user-add-or-edit.component.html',
  styleUrls: ['./user-add-or-edit.component.scss'],
})
export class UserAddOrEditComponent implements OnInit {
  public form: FormGroup;
  quillEditorModules = {};
  public advertiseImage: string = '';
  public infoImage: string = '';
  public popularImage: string = '';
  isEditMode = true;


  html = '';

  roleOptions = [
    { name: 'Manager', value: 'manager' },
    { name: 'Admin', value: 'admin' },
    { name: 'Editor', value: 'editor' },
    { name: 'Employee', value: 'employee' },
  ];
    constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<UserAddOrEditComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private loader: LoadingService,
    private matDialog: MatDialog,
  ) {
    this.onBuildForm();
  }

  ngOnInit() {
    if (this.dialogData) {
      this.form.patchValue(this.dialogData);
      this.isEditMode = false;
    }
  }

  onBuildForm() {
    this.form = this.fb.group({
      id: this.fb.control(''),
      username: this.fb.control('', [Validators.required]),
      is_require_reset_pw_at_first_time_login : this.fb.control(false),
      role: this.fb.control('', [Validators.required]),
      isAccountNonExpired: this.fb.control(true),
      isAccountNonLocked: this.fb.control(true),
      isCredentialsNonExpired: this.fb.control(true),
      isEnabled: this.fb.control(true),
      created_date:  this.fb.control(''),
      modified_date: this.fb.control('')
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    if (this.userId) {
      // UPDATE
      const loader = this.loader.show();
      delete this.form.value.is_require_reset_pw_at_first_time_login;
      this.userService
        .updateUser(this.form.value)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res) => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    } else {
      const loader = this.loader.show();
            this.userService.registerUser(this.form.value)
            .pipe(finalize(() => this.loader.hide(loader)))
            .subscribe((res) => {
            this.dialogRef.close(true);
          })}
    }

  get userId() {
    return this.form.get('id').value;
  }
}
