import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductRating } from '../../../models/dash-board-models';
import { IProduct, IReview } from 'src/app/model/model';
import { MatDialog } from '@angular/material/dialog';
import { SubmitReviewComponent } from '../submit-review/submit-review.component';
import { ProductService } from 'src/app/share/services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.scss']
})
export class ProductRatingComponent implements OnInit {
  @Input() product: IProduct;
  @Input()
  averageStar: number = 0
  @Input()
  value5Star: number = 0;
  @Input()
  value4Star: number = 0;
  @Input()
  value3Star: number = 0;
  @Input()
  value2Star: number = 0;
  @Input()
  value1Star: number = 0;

  askAndRepForm: FormGroup;
  customColor: string = '$accentColor'; // Replace with your desired color
  private _progressValue: number = 0
  get progressValue(): number {
    return this._progressValue;
  }

  set progressValue(value: number) {
    // Ensure the value is within the range of 0 to 100
    this._progressValue = Math.min(100, Math.max(0, value));
  }

  currentRating: number = 5;

  constructor(private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // Initialize the form controls with or without default values
    this.askAndRepForm = this.formBuilder.group({
      question: [''],
      sex: ['',],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      is_active: [false]
    });
  }
  controlNameTranslations: any = {
    'name': 'Họ Tên',
    'phone': 'Số điện thoại',
    'question':'Câu hỏi'
  };
  ngOnInit(): void {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SubmitReviewComponent, {
      width: 'fit-content',
      data: this.product,// Set the width of the dialog
    });

    // You can subscribe to the afterClosed event to get the result when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.router.navigate([this.router.url]);
      }
    });
  }

  onSubmit() {
    if (this.askAndRepForm.valid) {

      this.productService.postSendQuestion(this.product?.id, this.askAndRepForm.value).subscribe((response: any) => {
        this.router.navigate([this.router.url]);
      }, error => {
        // Handle errors
      });
    }
    else {
      const nullValueControls = Object.keys(this.askAndRepForm.controls).filter(controlName => {
        const control = this.askAndRepForm.get(controlName);
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

  getFirstChar(name: string) {
    return name.charAt(0).toLocaleUpperCase();
  }
}
