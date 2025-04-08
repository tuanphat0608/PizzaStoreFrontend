import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from "ngx-editor";
import { finalize } from 'rxjs';

import { CategoryService } from '../../../category/category.service';
import { LoadingService } from '../../../common/services/loading.service';
import { QuestionService } from '../../question.service';
import { CategoryModel } from '../../../common/models/category.model';
import { GetProductComponent } from '../get-product/get-product.component';

@Component({
  selector: 'app-post-add-or-edit',
  templateUrl: './question-add-or-edit.component.html',
  styleUrls: ['./question-add-or-edit.component.scss'],
})
export class QuestionAddOrEditComponent implements OnInit {
  form: FormGroup;
  formSend :FormGroup;
  avatar: string = '';
  categoryList: Array<CategoryModel> = [];
  quillEditorModules: any;
  listQuestion:any[] = [];
  html = '';

  productId: string;
  productName: string;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private questionService: QuestionService,
    private cd: ChangeDetectorRef,    
    private matDialog: MatDialog,

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
      id: this.fb.control(''),
      product_id: this.fb.control(''),
      product_name: this.fb.control(''),
      question: this.fb.array([]),
      is_active : this.fb.control(true),
    });
    this.formSend= this.fb.group({
      product_id: this.fb.control(''),
      product_name: this.fb.control(''),
      question: this.fb.control(''),
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

  uploadAvatar(event: any) {
    const files = event?.target?.files;
    if (files && files[0]) {
      const file = files[0];
      const loader = this.loader.show();
      this.questionService.uploadImage(file)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          this.form?.get('image_info')?.setValue(res[0]);
          this.cd.detectChanges();
        });
    }
  }

  onSave() {

    if (this.productId&&this.productName) {
      const loader = this.loader.show();
      this.form.get('question').value.forEach((element: any) => { 
        this.formSend.get('question').setValue(element);
        this.listQuestion.push(this.formSend.value)
      });
      this.questionService.questionBulk(this.listQuestion)
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
  patchValues(id: string, name: string, phone : string, email : string ,question : string, is_active : true) {
    return this.fb.group({
      id: [id],
      name: [name],
      phone: [phone],
      email: [email],
      question: [question],
      is_active : [is_active]
    })
  }
  onAddSpec() {
    const control = <FormArray>this.form.get('question');
    control.push(this.patchValues('','','','','',true))
  }
  specs: any = [
    {
      name: 'Thương hiệu',
      value: '',
    },
  ];
  onDeleteSpec(index: number) {
    const questions = this.form.get('question') as FormArray;
    questions.removeAt(index);
  }
  get questions(): FormArray {
    return this.form.get('question') as FormArray;
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
}
