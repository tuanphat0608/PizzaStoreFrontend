import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';

import { FlashsaleService } from '../../flashsale.service';
import { AddOrEditFlashsaleComponent } from '../add-or-edit-flashsale/add-or-edit-flashsale.component';
import { CategoryModel } from '../../../common/models/category.model';
import { LoadingService } from '../../../common/services/loading.service';
import { finalize } from 'rxjs';
import { AssignProductComponent } from '../assign-product/assign-product.component';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../login/auth.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './flashsale-list.component.html',
  styleUrls: ['./flashsale-list.component.scss'],
})
export class FlashsaleListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  role:string ='';

  public displayedColumns: string[] = [
    'check',
    'name',
    'product_size',
    'is_active',
    'startDate',
    'endDate',
    // 'is_adverties',
    'actions',
  ];

  public dataSource: MatTableDataSource<CategoryModel> = new MatTableDataSource<CategoryModel>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;

  constructor(
    private flashSaleService: FlashsaleService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getFlashSaleData();

    this.role = this.localStorageService.get('role');

  }

  getFlashSaleData() {
    const loader = this.loader.show();
    this.flashSaleService
      .getFlashale({
        page: this.pageIndex,
        size: this.pageSize,
        status: "Active"
      })
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.totalItems = response?.totalElements;
        this.dataSource = new MatTableDataSource(response?.content || []);
      });
  }

  onNavigate() {
    this.router.navigate([
      RouterConstants.PRODUCT_PAGE,
      RouterConstants.PRODUCT_CREATE,
    ]);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getFlashSaleData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

  onDelete(item: CategoryModel) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa <span class="highlight"><b>${item.name}</b></span> ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.flashSaleService.deleteFlashSale(item)
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getFlashSaleData();
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
          content: `Bạn có chắc muốn xóa những danh mục đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.flashSaleService
          .deleteMultipleFlashSale(this.selectedElements.map((m: any) => m.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((res) => {
            this.getFlashSaleData();
          });
      }
    });

  }

  onAddNew() {
    const dialogRef = this.matDialog.open(AddOrEditFlashsaleComponent, {
      maxWidth: '50vw',
      maxHeight: '90vh',
      height: 'auto',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getFlashSaleData();
      }
    });
  }

  onEdit(category: CategoryModel) {
    const loader = this.loader.show();
    this.flashSaleService.getFlashSaleDetail(category.id)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((res) => {
        if (res) {
          const dialogRef = this.matDialog.open(AddOrEditFlashsaleComponent, {
            maxWidth: '40vw',
            maxHeight: '90vh',
            height: 'auto',
            width: '500px',
            data: category,
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.getFlashSaleData();
            }
          });
        }
      });
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
        this.getFlashSaleData();
      }
    })

  }

  changeCategoryStatus(singleCategory: CategoryModel) {
    let ids: string[] = [];
    if (singleCategory) {
      ids = [singleCategory.id];
    } else {
      ids = [...this.selectedElements.map(el => el.id)];
    }
  }

  onChangeStatus(status: boolean, item: CategoryModel) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn thay đổi trạng thái của <span class="highlight"><b>${item.name}</b></span> không ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.flashSaleService.changeStatus({ bulkEdits: [{ id: item.id, isActive: status }] })
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getFlashSaleData(); }
          })
      } else {
        item.is_active = !status;
      }
    });
  }

  onUpdate(status: boolean, item: CategoryModel, key: any) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn thay đổi trạng thái của <span class="highlight"><b>${item.name}</b></span> không ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.flashSaleService.updateNewFlashSale(item)
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getFlashSaleData(); }
          })
      } else {
        if (key == 'is_advertise') {
          item.is_advertise = !status;
        } else if (key == 'is_popular') {
          item.is_popular = !status;
        } else {
          item.is_show_in_dashboard = !status;
        }
      }
    });
  }

  get selectedElements() {
    return this.dataSource.data.filter((el: CategoryModel) => el.checked);
  }
}
