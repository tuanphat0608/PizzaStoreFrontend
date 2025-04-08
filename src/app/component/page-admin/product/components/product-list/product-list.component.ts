import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { ProductModel } from '../../../common/models/product.model';
import { LoadingService } from '../../../common/services/loading.service';
import { ProductService } from '../../product.service';
import { AddNewProductComponent } from "../add-new-product/add-new-product.component";
import { AuthService } from '../../../login/auth.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';
import { CategoryModel } from '../../../common/models/category.model';
import { AssignProductComponent } from '../assign-product/assign-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  role:string ='';

  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'images',
    'name',
    'product_size',
    'price',
    'list_price',
    'stock',
    'label',
    'is_active',
    'actions',
  ];

  public dataSource: MatTableDataSource<ProductModel> =
    new MatTableDataSource<ProductModel>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public keySearch: string;

  constructor(    
    private authService: AuthService,
    private productService: ProductService, 
    private router: Router, 
    private localStorageService: LocalStorageService,
    private loader: LoadingService, 
    private matDialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getProductData();
    this.role = this.localStorageService.get('role');
  }


  getProductData(keySeach?: string) {
    if(keySeach){
      this.keySearch = keySeach
    }
    this.productService
      .getProduct({
        page: this.pageIndex,
        size: this.pageSize,
      },
      this.keySearch)
      .subscribe((response: any) => {
        this.totalItems = response?.totalElements;
        this.dataSource = new MatTableDataSource(response?.content || []);
      });
  }

  onNavigate() {
    this.router.navigate([RouterConstants.ADMIN, RouterConstants.PRODUCT_PAGE, RouterConstants.PRODUCT_CREATE]);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getProductData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

  onDelete(item: ProductModel) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa <span class="highlight"><b>${item.id}</b></span> ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        const sendData = []
        sendData.push(item.id)
        this.productService.deleteProduct(sendData)
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getProductData();
          });
      }
    });

  }

  onDeleteMultiple() {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa những sản phẩm đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.productService.deleteProduct(this.selectedElements.map((el: ProductModel) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getProductData();
          });
      }
    });
  }

  onChangeStatus(product: ProductModel, event: boolean) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn thay đổi trạng thái của <span class="highlight"><b>${product.name}</b></span> không ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.productService.changeStatus({ bulkEdits: [{ id: product.id, isActive: event }] })
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getProductData(); }
          })
      } else {
        product.is_active = !status;
      }
    });
  }

  onEdit(item: any) {


    const dialogRef = this.matDialog.open(AddNewProductComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProductData();
      }
    })
  }

  get selectedElements() {
    return this.dataSource.data.filter((el: any) => el.checked);
  }

  onAddNew() {
    const dialogRef = this.matDialog.open(AddNewProductComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProductData();
      }
    })
  }

  onSeachChange() {
    this.pageIndex = 0;
    this.getProductData(this.keySearch);
  }
  onAssignProduct(category: CategoryModel) {
    const dialogRef = this.matDialog.open(AssignProductComponent, {
      width: '80vw',
      maxWidth: '1300px',
      height: 'auto',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProductData();
      }
    })

  }
}
