import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from "ngx-editor";
import { finalize } from 'rxjs';

import { CategoryModel } from '../../../common/models/category.model';
import { LoadingService } from '../../../common/services/loading.service';
import { FlashsaleService } from '../../flashsale.service';
import { AssignProductComponent } from '../assign-product/assign-product.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-or-edit-category',
  templateUrl: './add-or-edit-flashsale.component.html',
  styleUrls: ['./add-or-edit-flashsale.component.scss'],
  providers: [DatePipe]
})
export class AddOrEditFlashsaleComponent implements OnInit {
  public form: FormGroup;
  quillEditorModules = {};
  public advertiseImage: string = '';
  public infoImage: string = '';
  public popularImage: string = '';
  startDate :string;
  endDate :string;

  html = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: FlashsaleService,
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AddOrEditFlashsaleComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: CategoryModel,
    private loader: LoadingService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.onBuildForm();
  }

  ngOnInit() {
    if (this.dialogData) {
      this.form.patchValue(this.dialogData);
      this.advertiseImage = this.dialogData.advertise_image?.path;
      this.infoImage = this.dialogData.image_info?.path;
    }
  }

  onBuildForm() {
    this.form = this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(null, [Validators.required]),
      status :this.fb.control(''), 
      listProducts: this.fb.control([]),
      is_active: this.fb.control(false),
      startDate: this.fb.control('', [Validators.required]),
      endDate: this.fb.control('', [Validators.required]),
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    if (this.flashSaleId) {
      // UPDATE
      const loader = this.loader.show();
      this.categoryService
        .updateNewFlashSale(this.form.value)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res) => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    } else {
      const loader = this.loader.show();
      this.categoryService.addNewFlashSale(this.form.value)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res) => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    }
  }

  onAssignProduct() {
    const dialogRef = this.matDialog.open(AssignProductComponent, {
      width: '80vw',
      maxWidth: '1300px',
      height: 'auto',
      data: this.form.value,
    });
  }

  get flashSaleId() {
    return this.form.get('id').value;
  }
}
