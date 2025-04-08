import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { PostModel } from '../../../common/models/post.model';
import { LoadingService } from '../../../common/services/loading.service';
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {BrandService} from "../../../../../share/services/brand.service";
import {ToastrService} from "ngx-toastr";
import { AuthService } from '../../../login/auth.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandListComponent implements OnInit {
  // @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'name',
    'actions',
  ];

  public dataSource: MatTableDataSource<PostModel> =
    new MatTableDataSource<PostModel>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public isSystemFilter: boolean = false;
  role:string ='';
  constructor(
    private brandService: BrandService,
    private toastr: ToastrService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,

  ) { }


  ngOnInit() {
    this.getBrandData();
    this.role = this.localStorageService.get('role');

  }

  getBrandData() {
    const loader = this.loader.show();
    this.brandService
      .getAllBrand()
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.dataSource = new MatTableDataSource(response || []);
      });
  }


  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBrandData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

  onDelete(item: PostModel) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa <span class="highlight"><b>${item.title}</b></span> ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.brandService.deleteBrand([item.id])
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getBrandData();
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
          content: `Bạn có chắc muốn xóa những tin tức đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.brandService.deleteBrand(this.selectedElements.map((el: PostModel) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getBrandData();
          });
      }
    });
  }

  onAddNew() {
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
            this.getBrandData();
            },
          error: error => {
            this.toastr.error('Thêm mới không thành công');
          }
        })
      }
    });
  }

  onEdit(item: any) {
    const dialogRef = this.matDialog.open(
      QuickNewDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: item.name
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.name = result;
        //add new
        this.brandService.updateBrand(item).subscribe({
          next: brand => {
            this.toastr.success('Thêm mới thành công');
            this.getBrandData();
          },
          error: error => {
            this.toastr.error('Thêm mới không thành công');
          }
        })
      }
    });
  }


  get selectedElements() {
    return this.dataSource.data.filter((el: PostModel) => el.checked);
  }
}
