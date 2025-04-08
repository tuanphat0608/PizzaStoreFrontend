import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Editor, Toolbar} from "ngx-editor";
import {finalize} from 'rxjs';

import {CategoryModel} from '../../../common/models/category.model';
import {LoadingService} from '../../../common/services/loading.service';
import {CategoryService} from '../../category.service';
import {AssignProductComponent} from '../assign-product/assign-product.component';
import Quill from "quill";

@Component({
  selector: 'app-add-or-edit-category',
  templateUrl: './add-or-edit-category.component.html',
  styleUrls: ['./add-or-edit-category.component.scss'],
})
export class AddOrEditCategoryComponent implements OnInit {
  public form: FormGroup;
  quillEditorModules = {};
  public advertiseImage: string = '';
  public advertiseImageMobile: string = '';
  public infoImage: string = '';
  public popularImage: string = '';


  html = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AddOrEditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: CategoryModel,
    private loader: LoadingService,
    private matDialog: MatDialog
  ) {
    this.onBuildForm();
  }

  ngOnInit() {
    if (this.dialogData) {
      this.form.patchValue(this.dialogData);
      if (this.quill) {
        this.quill.root.innerHTML = this.form.get('content').value;
      }
      this.advertiseImage = this.dialogData.advertise_image?.path;
      this.advertiseImageMobile = this.dialogData.advertise_image_mobile?.path;
      this.infoImage = this.dialogData.image_info?.path;
      this.popularImage = this.dialogData.avatar?.path;
    }
  }

  quill: Quill;

  ngAfterViewInit(): void {
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],
      [{'indent': '-1'}, {'indent': '+1'}],
      [{'direction': 'rtl'}],
      [{'size': ['small', false, 'large', 'huge']}],
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      ['link', 'image'],
      ['clean']
    ];
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow',
    });
    this.quill.getModule("toolbar").addHandler("image", () => {
      this.selectLocalImage();
    });
    this.quill.on('text-change', () => {
      this.form?.get('content')?.setValue(this.quill.root.innerHTML);
    })
  }

  selectLocalImage() {
    console.log('selectLocalImage')
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        this.saveToServer(file);
      } else {
        console.warn("Only images can be uploaded here.");
      }
    };
  }

  saveToServer(file: any) {
    const loader = this.loader.show();
    this.categoryService.uploadImage(file)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((res: any) => {
        this.insertToEditor(res[0]?.path)
      });
  }

  insertToEditor(url: any) {
    // push image url to editor.
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range.index, "image", url);
  }

  onBuildForm() {
    this.form = this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(null, [Validators.required]),
      content: this.fb.control(''),
      full_name: this.fb.control('', [Validators.required]),
      priority: this.fb.control(0, [Validators.required]),
      image_info: this.fb.control(null),
      advertise_image: this.fb.control(null),
      advertise_image_mobile: this.fb.control(null),
      avatar: this.fb.control(null),
      view: [0],
      is_advertise: this.fb.control(false),
      is_popular: this.fb.control(false),
      is_show_in_dashboard: this.fb.control(false),
    });
  }

  onUploadImage(event: any, type: number) {
    const files = event?.target?.files;
    if (files && files[0]) {
      const file = files[0];
      const loader = this.loader.show();
      this.categoryService.uploadImage(file)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          if (type == 0) {
            this.form.get('advertise_image').setValue(res[0]);
            this.advertiseImage = res[0]?.path;
            this.cd.detectChanges();
          } else if (type == 1) {
            this.form.get('image_info').setValue(res[0]);
            this.infoImage = res[0]?.path;
            this.cd.detectChanges();
          } else if (type == 3) {
            this.form.get('advertise_image_mobile').setValue(res[0]);
            this.advertiseImageMobile = res[0]?.path;
            this.cd.detectChanges();
          } else {
            this.form.get('avatar').setValue(res[0]);
            this.popularImage = res[0]?.path;
            this.cd.detectChanges();
          }
        });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    if (this.categoryId) {
      // UPDATE
      const loader = this.loader.show();
      this.categoryService
        .updateNewCategory(this.form.value)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res) => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    } else {
      const loader = this.loader.show();
      this.categoryService.addNewCategory(this.form.value)
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

  get categoryId() {
    return this.form.get('id').value;
  }
}
