import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from "ngx-editor";
import { finalize } from 'rxjs';

import { CategoryService } from '../../../category/category.service';
import { LoadingService } from '../../../common/services/loading.service';
import { ReviewService } from '../../review.service';
import { CategoryModel } from '../../../common/models/category.model';
import { GetProductComponent } from '../../../question/components/get-product/get-product.component';
import { QuestionAddOrEditComponent } from '../../../question/components/question-add-or-edit/question-add-or-edit.component';
import { QuestionService } from '../../../question/question.service';
import { ImageInfo } from '../../../common/models/image-info.model';
import { ProductService } from '../../../product/product.service';
import { IImageInfo } from 'src/app/model/model';

@Component({
  selector: 'app-post-add-or-edit',
  templateUrl: './review-add-or-edit.component.html',
  styleUrls: ['./review-add-or-edit.component.scss'],
})
export class ReviewAddOrEditComponent implements OnInit {
  form: FormGroup;
  formSend :FormGroup;
  avatar: string = '';
  categoryList: Array<CategoryModel> = [];
  quillEditorModules: any;
  listQuestion:any[] = [];
  html = '';
  files: File[];
  filePaths: String[] = [];

  productId: string;
  productName: string;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private ReviewService: ReviewService,
    private cd: ChangeDetectorRef,    
    private matDialog: MatDialog,
    private productService: ProductService,

    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<QuestionAddOrEditComponent>,
    private loader: LoadingService
  ) {
    this.onBuildForm();
    this.quillEditorModules = {
      blotFormatter: {},
    };
  }

  ngOnInit() {
    this.getAllCategory();
    if (this.dialogData) {
      this.form.patchValue(this.dialogData);
      this.form.get('category').setValue(this.dialogData.category.id);
    }
  }

  onBuildForm() {
    this.form = this.fb.group({
      product_id: this.fb.control(this.productId),
      product_name: this.fb.control(this.productName),
      content: this.fb.array([]),
      is_active : this.fb.control(true),
      rating_point: this.fb.control(0),
      image_list : this.fb.array([]),
    });
    this.formSend = this.fb.group({
      product_id: this.fb.control(this.productId),
      product_name: this.fb.control(this.productName),
      review: this.fb.control(''),
    });
  }

  getAllCategory() {
    const loader = this.loader.show();
    this.categoryService
      .getCategory({ page: 0, size: 10000 })
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.categoryList = response.content;
      });
  }


  onSave() {

    if (this.productId&&this.productName) {
      const loader = this.loader.show();
      this.form.get('content').value.forEach((element: any) => { 
        this.formSend.get('review').setValue(element);
        this.listQuestion.push(this.formSend.value)
      });
      this.ReviewService.ReviewBulk(this.listQuestion)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      });
    } 
  }




  tagDataArray: Array<any> = [];
  tagDatas: any = null;

  addTag() {
    if (this.tagDataArray.find(f => f.value == this.tagDatas)) {
      return;
    }

    this.tagDataArray.push({
      id: null,
      value: this.tagDatas
    });
    this.tagDatas = null;
  }

  removeTag(tag: any) {
    this.tagDataArray.splice(this.tagDataArray.findIndex(f => f.value == tag.value), 1);
  }

  get categoryInfo() {
    return this.categoryList.find(f => f.id == this.form.get('category').value);
  }
  patchValues( customer_name: string, customer_phone: string, email: string, content: string, is_active: true) {
    return this.fb.group({
      customer_name: [customer_name],
      customer_phone: [customer_phone],
      email: [email],
      content: [content],
      is_active: [is_active],
      image_list: [],
      rating_point : 5
    });
  }
  
  createImageFormGroup(image: any) {
    return this.fb.group({
      id: [image.id],
      path: [image.path]
    });
  }
  onAddSpec() {
    const control = <FormArray>this.form.get('content');
    control.push(this.patchValues('', '', '', '', true));
  }
  specs: any = [
    {
      name: 'Thương hiệu',
      value: '',
    },
  ];
  onDeleteSpec(index: number) {
    const questions = this.form.get('content') as FormArray;
    questions.removeAt(index);
  }
  get Reviews(): FormArray {
    return this.form.get('content') as FormArray;
  }
  getImages(questionControl: AbstractControl): IImageInfo[] {
  
    const imgControl = questionControl.get('image_list');
  
    if (imgControl && imgControl.value) {
      return imgControl.value;
    }
    return[];
  }
  onAssignProduct() {
    const dialogRef = this.matDialog.open(GetProductComponent, {
      width: '80vw',
      maxWidth: '1300px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listQuestion= [];
        this.productName = result.name;
        this.productId = result.id;
        this.formSend.get('product_id').setValue(this.productId);
        this.formSend.get('product_name').setValue(this.productName);
      }
    })
  }

  onDropFiles(files: any): void {
    // this.files = [...this.files, ...files];
  }

  selectFiles(event: any,i:any) {
    this.files = event?.target?.files;
    if (this.files) {
      const loader = this.loader.show();
      this.productService.uploadImage(this.files)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: IImageInfo[]) => {
          const control = <FormArray>this.form.get('content');
          const imageListControl = control.at(i).get('image_list');
          const currentValues = imageListControl.value || []; // Get the current values or initialize as an empty array
          const updatedValues = currentValues.concat(res); // Add the new value
          
          // Use setValue or patchValue to update the form control
          imageListControl.setValue(updatedValues);
  
        });
    }
  }
  onRemoveImage(i: number) {
    this.files.splice(i, 1);
  }

}
