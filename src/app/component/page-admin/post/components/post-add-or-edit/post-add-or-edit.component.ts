import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs';

import {CategoryService} from '../../../category/category.service';
import {LoadingService} from '../../../common/services/loading.service';
import {PostService} from '../../post.service';
import {CategoryModel} from '../../../common/models/category.model';
import {QuillEditorComponent} from "ngx-quill";
import Quill from "quill";

@Component({
  selector: 'app-post-add-or-edit',
  templateUrl: './post-add-or-edit.component.html',
  styleUrls: ['./post-add-or-edit.component.scss'],
})
export class PostAddOrEditComponent implements OnInit {
  form: FormGroup;
  avatar: string = '';
  categoryList: Array<CategoryModel> = [];
  quillEditorModules: any;


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private postService: PostService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<PostAddOrEditComponent>,
    private loader: LoadingService
  ) {
    this.onBuildForm();
    // this.quillEditorModules = {
    //   blotFormatter: {},
    // };
  }

  ngOnInit() {

    this.getAllCategory();
    if (this.dialogData?.id) {
      this.postService.getNewsById(this.dialogData).subscribe((res: any) => {
        this.form.patchValue(res);
        this.selectedCat = res.category.id
        this.form.get('category').setValue(res.category.id);
        console.log(this.form.get('content'))
        if( this.quill){
          this.quill.root.innerHTML = this.form.get('content').value;
        }
      })
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
    this.postService.uploadImage(file)
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
      title: this.fb.control(''),
      content: this.fb.control(''),
      category: this.fb.control(''),
      view: this.fb.control(0),
      image_info: this.fb.control(null),
      is_active: this.fb.control(true),
      is_system: this.fb.control(false)
    });
  }

  getAllCategory() {
    const loader = this.loader.show();
    this.categoryService
      .getCategory({page: 0, size: 10000})
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.categoryList = response.content;
        this.form.get('category').setValue(this.categoryList?.[0].id);
        this.selectedCat = this.categoryList?.[0].id

      });
  }

  uploadAvatar(event: any) {
    const files = event?.target?.files;
    if (files && files[0]) {
      const file = files[0];
      const loader = this.loader.show();
      this.postService.uploadImage(file)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          this.form?.get('image_info')?.setValue(res[0]);
          this.cd.detectChanges();
        });
    }
  }

  onSave() {

    if (this.postId) {
      const loader = this.loader.show();
      this.postService.updateNews({...this.form.value, category: this.categoryInfo})
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe(res => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    } else {
      const loader = this.loader.show();
      this.postService.createNews({...this.form.value, category: this.categoryInfo, tags: this.tagDataArray})
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe(res => {
          if (res) {
            this.dialogRef.close(true);
          }
        });
    }
  }

  get postId() {
    return this.form.get('id').value;
  }

  get imageInfo() {
    return this.form?.get('image_info')?.value?.path;
  }

  tagDataArray: Array<any> = [];
  tagDatas: any = null;
  selectedCat: any;

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
}
