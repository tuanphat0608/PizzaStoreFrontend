import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../../common/services/loading.service';
import { ReviewService } from '../../review.service';
import { ReviewAddOrEditComponent } from '../review-add-or-edit/review-add-or-edit.component';
import {IGenericProduct, IReview} from "../../../../../model/model";
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'image_list',
    'name',
    'phone',
    'rating',
    'content',
    'actions',
  ];

  public dataSource: MatTableDataSource<IReview> =
    new MatTableDataSource<IReview>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public isActiveFilter: boolean = false;

  constructor(
    private toastr: ToastrService,
    private reviewService: ReviewService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getReviewData();
  }

  getReviewData() {
    const loader = this.loader.show();
    this.reviewService
      .getReview({
        page: this.pageIndex,
        size: this.pageSize,
        is_active: this.isActiveFilter
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

  onChangeFilter() {
    this.getReviewData();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getReviewData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

  onDelete(item: IReview) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa <span class="highlight"><b></b></span> ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.reviewService.deleteReview([item.id])
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getReviewData();
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
        this.reviewService.deleteReview(this.selectedElements.map((el: IReview) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getReviewData();
          });
      }
    });
  }

  onAddNew() {
    const dialogRef = this.matDialog.open(ReviewAddOrEditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getReviewData();
      }
    })
  }

  onEdit(item: IReview) {
    const dialogRef = this.matDialog.open(
      QuickNewDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: item.content
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.content = result;
        //add new
        this.reviewService.updateReview(item).subscribe({
          next: brand => {
            this.toastr.success('Cập nhật thành công');
            this.getReviewData();
          },
          error: error => {
            this.toastr.error('Cập nhật không thành công');
          }
        })
      }
    });
  }


  onChangeStatus(status: boolean, item: IReview) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn thay đổi trạng thái của nhận xét này không ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.reviewService.changeStatus({ bulkEdits: [{ id: item.id, isActive: status }] })
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getReviewData(); }
          })
      } else {
        item.is_active = !status;
      }
    });
  }

  onHideMultipleReview() {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn ẩn những nhận xét đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.reviewService.hideReview(this.selectedElements.map((el: any) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getReviewData(); }
          })
      }
    });
  }
  get selectedElements() {
    return this.dataSource.data.filter((el: IReview) => el.checked);
  }
}
