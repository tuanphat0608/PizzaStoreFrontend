import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment/moment';
import BlotFormatter from 'quill-blot-formatter';
import Quill from 'quill';
import {DomSanitizer} from '@angular/platform-browser';
import {PostPrivacy, PostStatus,} from 'src/app/core/common.enum';
import {Post} from 'src/app/core/models/post.model';
import {CategoryModel} from "../../../common/models/category.model";
import {LoadingService} from "../../../common/services/loading.service";
import {CategoryService} from "../../../category/category.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {finalize} from "rxjs";
import {ProductService} from "../../product.service";
import {IBrand, IImageInfo, IProduct} from "../../../../../model/model";
import {BrandService} from "../../../../../share/services/brand.service";
import {ConfirmDialogComponent} from "../../../common/components/confirm-dialog/confirm-dialog.component";
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent implements OnInit {
  idImage: string;
  form: FormGroup;
  categoryList: Array<CategoryModel> = [];
  templateForm: FormGroup;
  quillEditorModules = {};
  wordCount = 0;
  lastUpdated: any;
  postStatus = PostStatus;
  postPrivacy = PostPrivacy;
  postProductTypes: any = [
    'Sản phẩm chính hãng, Fullbox nguyên seal',
    'Hàng cũ đã qua sử dụng, Fullbox hình thức đẹp',
  ];
  postProductLabel: any = [
    'HOT',
    'NEW',
    'SALE',
  ];

  @Input() post: Post = {
    status: this.postStatus.Draft,
    privacy: this.postPrivacy.Public,
  };
  private interval: any;
  selectedProductType: any;
  tagDatas: string;
  tagDataArray: string[] = [];
  listPrice: any;
  price: any;
  specs: any = [
    {
      name: 'Thương hiệu',
      value: '',
    },
  ];
  productName: any;
  selectedProductLabel: any;
  files: File[];
  filePaths: String[] = [];
  product: IProduct;
  private categoryArray: CategoryModel[];
  selectedProductBrand: any;
  productBrands: any;

  constructor(
    private toastr: ToastrService,
    private loader: LoadingService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private brandService: BrandService,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<AddNewProductComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.onBuildForm();
    this.quillEditorModules = {
      blotFormatter: {},
    };
    this.lastUpdated = moment()
      .locale('vn')
      .format('dddd, DD MMMM yyyy, HH:mm');
  }

  getAllCategory() {
    const loader = this.loader.show();
    this.categoryService
      .getCategory({page: 0, size: 10000})
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.categoryList = response.content;
        this.product?.categories?.forEach(c => {
          this.categoryList.find(c2 => c2.id == c.id).checked = true;
        });
      });
  }

  saveParagraph() {
    alert(this.templateForm.get('textEditor')!.value);
  }

  contentChange(event: any) {
    this.wordCount =
      event.text && event.text !== '\n'
        ? event.text.trim().split(' ').length
        : 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.lastUpdated = moment().format('dddd, DD MMMM yyyy, HH:mm');
    }, 1000);
  }


  check() {
  }

  get specifications(): FormArray {
    return this.form.get('specifications') as FormArray;
  }

  ngOnInit(): void {
    this.reloadBrand();
    if (this.dialogData) {
      this.productService.getProductById(this.dialogData).subscribe((data: IProduct) => {
        this.form.patchValue(data);
        if (this.quill) {
          this.quill.root.innerHTML = this.form.get('description').value;
        }
        this.product = data;
        this.selectedProductType = data.product_type;
        this.selectedProductBrand = data.brand;
        this.selectedProductLabel = data.label;
        const control = <FormArray>this.form.get('specifications');
        data.specifications.forEach(d => {
          control.push(this.patchValues(d.key, d.value))
        });
        const controlCat = <FormArray>this.form.get('categories');
        data.categories.forEach(c => {
          controlCat.push(this.fb.group({
            id: [c.id],
            name: [c.name]
          }));
        });
        const controlImage = <FormArray>this.form.get('images');
        data.images.forEach(r => {
          controlImage.push(this.fb.group({
            id: [r.id],
            path: [r.path]
          }));
          this.filePaths.push(r.path);
        });
        this.getAllCategory();

      })
    } else {
      this.getAllCategory();
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
      this.form?.get('description')?.setValue(this.quill.root.innerHTML);
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
    this.productService.uploadImage([file])
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
      is_active: this.fb.control(false),
      categories: this.fb.array([], [Validators.required]),
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      view: this.fb.control(0),
      price: this.fb.control(''),
      price6: this.fb.control(''),
      price12: this.fb.control(''),
      price15: this.fb.control(''),
      price18: this.fb.control(''),
      price24: this.fb.control(''),
      warranty: this.fb.control(''),
      listPrice: this.fb.control(''),
      specification: this.fb.control(''),
      specifications: this.fb.array([]),
      images: this.fb.array([]),
      promotion_description: this.fb.control(''),
      number_of_replace_day: this.fb.control(''),
      product_type: this.fb.control(''),
      stock: this.fb.control(0),
      label: this.fb.control(''),
      created_date: this.fb.control(Date.now()),
      brand: this.fb.group({
        id: '',
        name: ''
      }),
      is_installment_support: this.fb.control(false),
      is_shipment_support: this.fb.control(false),
    });
  }

  patchValues(label: string, value: string) {
    return this.fb.group({
      key: [label],
      value: [value]
    })
  }

  get productId() {
    return this.form.get('id').value;
  }


  addTag() {
    if (this.tagDatas) {
      let tagDataSplit = this.tagDatas.split(',');
      for (let tag of tagDataSplit) {
        if (this.tagDataArray.filter((t) => t === tag).length < 1)
          this.tagDataArray.push(tag);
      }
      this.tagDatas = '';
    }
  }

  removeTag(tag: string) {
    const idx = this.tagDataArray.findIndex((t) => t === tag);
    this.tagDataArray.splice(idx, 1);
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
          const control = <FormArray>this.form.get('images');
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


  onRemoveImage(i: number) {
    const imageIndex = this.filePaths.at(i); // Assuming imageIndex is an AbstractControl
    this.filePaths.splice(i, 1);
    const controlImage = this.form.get('images') as FormArray;

    const indexToRemove = controlImage.controls.findIndex((x: any) => x.get('path').value === imageIndex);

    if (indexToRemove !== -1) {
      // Remove the control at the specified index
      controlImage.removeAt(indexToRemove);
    }
  }


  onAddSpec() {
    const control = <FormArray>this.form.get('specifications');
    control.push(this.patchValues('', ''))
  }

  onDeleteSpec(i: number) {
    const control = <FormArray>this.form.get('specifications');
    control.removeAt(i);
  }

  onSave() {
    if (this.productId) {
      const loader = this.loader.show();
      this.productService.updateProduct({...this.form.value})
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe({
          next: res => {
            if (res) {
              this.toastr.success('Cập nhật thành công');
              this.dialogRef.close(true);
            }
          },
          error: error => {
            this.toastr.error('Lỗi');
          }
        });
    } else {
      const loader = this.loader.show();
      this.productService.createProduct({...this.form.value})
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe({
          next: res => {
            if (res) {
              this.toastr.success('Thêm mới thành công');
              this.dialogRef.close(true);
            }
          },
          error: error => {
            this.toastr.error('Lỗi');
          }
        });
    }
  }

  onCategoryChange() {
    const control = <FormArray>this.form.get('categories');
    control.controls = [];
    this.categoryList.forEach(c => {
      if (c.checked) {
        control.push(this.fb.group({
          id: [c.id],
          name: [c.name]
        }));
      }
    });
  }

  selectProductBrand(productBrand: any) {
    this.selectedProductBrand = productBrand;
    this.form.get('brand').setValue({
      id: this.selectedProductBrand.id,
      name: this.selectedProductBrand.name
    });
    // this.form.get('brand').setValue(productBrand);

  }

  selectProductType(productType?: any) {
    this.selectedProductType = productType;
    this.form.get('product_type').setValue(productType);
  }

  selectProductLabel(productLabel?: any) {
    this.selectedProductLabel = productLabel;
    this.form.get('label').setValue(productLabel);
  }

  onAddNewBrandClick() {
    const dialogRef = this.matDialog.open(
      QuickNewDialogComponent,
      {
        width: '600px',
        height: 'auto',
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //add new
        this.brandService.createBrand({name: result}).subscribe({
          next: brand => {
            this.toastr.success('Thêm mới thành công');
            this.reloadBrand();
          },
          error: error => {
            this.toastr.error('Thêm mới không thành công');
          }
        })
      }
    });
  }

  reloadBrand() {
    const loader = this.loader.show();
    this.brandService.getAllBrand()
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((brands: IBrand[]) => {
        this.productBrands = brands;
      })
  }

  onUpdateImage(event: any, i: number) {
    const imageIndex = this.filePaths.at(i);
    const controlImage = this.form.get('images') as FormArray;
    const filteredImages = controlImage.value.filter((x: IImageInfo) => x.path === imageIndex);

    // Assuming you want the id of the first matching image, if any
    this.idImage = filteredImages.length > 0 ? filteredImages[0].id : null;
    this.files = event?.target?.files;
    if (this.files) {
      const loader = this.loader.show();
      this.productService.updateImages(this.idImage, this.files)
        .pipe(finalize(() => this.loader.hide(loader)))
        .subscribe((res: any) => {
          const control = <FormArray>this.form.get('images');
          control.controls[i].patchValue({path: res.path});

          this.filePaths[i] = (res.path);
        });
      ;
    }
  }

  // @ts-ignore

}
