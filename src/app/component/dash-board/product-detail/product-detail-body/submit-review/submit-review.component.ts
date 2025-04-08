import { Component ,Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { LoadingService } from 'src/app/component/page-admin/common/services/loading.service';
import { IImageInfo, IProduct } from 'src/app/model/model';
import { ProductService } from 'src/app/share/services/product.service';

@Component({
  selector: 'app-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.scss']
})
export class SubmitReviewComponent implements OnInit {
  controlNameTranslations: any = {
    'content' : 'Đánh Giá',
    'customer_name': 'Họ Tên',
    'customer_phone': 'Số điện thoại',
  };
  product: IProduct;
  filePaths: String[] = [];
  files: File[];
  review: FormGroup;
  ratingData :number;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private toastr: ToastrService,
  private loader: LoadingService,
  private fb: FormBuilder,
  private productService: ProductService,
  private dialogRef: MatDialogRef<SubmitReviewComponent>
  ) {
    this.review = this.fb.group({
      content: ['', Validators.required],
      rating_point: [0],
      customer_name: ['', Validators.required],
      customer_phone: ['', Validators.required],
      is_remember_me: [''],
      image_list: this.fb.array([]),
    });
  }
  ngOnInit(): void {
this.product= this.dialogData

  }
  onDropFiles(files: any): void {
    // this.files = [...this.files, ...files];
  }

  selectFiles($event: any) {
    // @ts-ignore
    this.files = event?.target?.files;
    if (this.files) {
      const loader = this.loader.show();
      this.productService.uploadImage(this.files)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: IImageInfo[]) => {
          const control = <FormArray>this.review.get('image_list');
          res.forEach(r => {
            control.push(this.fb.group({
              id: [r.id],
              path: [r.path]
            }));
            this.filePaths.push(r.path);
          });
        });
    }
  }
  getRating(rating :number){
    this.review.get('rating_point').setValue(rating);
  }

  onRemoveImage(i: number) {
    this.files.splice(i, 1);
  }

  sendReview(){
    if (this.review.valid) {

    this.productService.postReview(this.product?.id,this.review.value).subscribe((response:any) => {
      this.dialogRef.close(true);
    }, error => {
      // Handle errors
    });
  }else{
    const nullValueControls = Object.keys(this.review.controls).filter(controlName => {
      const control = this.review.get(controlName);
      return control?.value == null || control?.value == undefined || control?.value == "";
    });
    const nullValueControlsTranslated = nullValueControls.map(controlName => this.controlNameTranslations[controlName]);
    const filteredArray = [];
    for (const item of nullValueControlsTranslated) {
      if (item !== undefined) {
        filteredArray.push(item);
      }
    }
    this.toastr.error('Vui lòng nhập ' + filteredArray)
  }
  }

  GetLengthContent(){
    return this.review.get('content').value.length;
  }
}
