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
import { PostService } from '../../post.service';
import { PostAddOrEditComponent } from '../post-add-or-edit/post-add-or-edit.component';
import { AuthService } from '../../../login/auth.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  role:string ='';

  public displayedColumns: string[] = [
    'check',
    'image_info',
    'title',
    'view',
    'category_name',
    'is_active',
    'actions',
  ];

  public dataSource: MatTableDataSource<PostModel> =
    new MatTableDataSource<PostModel>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public isSystemFilter: boolean = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService,
    private localStorageService: LocalStorageService,

  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getPostData();
    this.role = this.localStorageService.get('role');

  }

  getPostData() {
    const loader = this.loader.show();
    this.postService
      .getNews({
        page: this.pageIndex,
        size: this.pageSize,
        is_system: this.isSystemFilter
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
    this.getPostData();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPostData();
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
        this.postService.deleteNews([item.id])
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getPostData();
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
        this.postService.deleteNews(this.selectedElements.map((el: PostModel) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getPostData();
          });
      }
    });
  }

  onAddNew() {
    const dialogRef = this.matDialog.open(PostAddOrEditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPostData();
      }
    })
  }

  onEdit(item: any) {
    const dialogRef = this.matDialog.open(PostAddOrEditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPostData();
      }
    })
  }

  onHideMultiplePost() {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn ẩn những tin tức đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.postService.hidePost(this.selectedElements.map((el: any) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getPostData(); }
          })
      }
    });
  }

  onChangeStatus(status: boolean, item: PostModel) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn thay đổi trạng thái của <span class="highlight"><b>${item.title}</b></span> không ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.postService.changeStatus({ bulkEdits: [{ id: item.id, isActive: status }] })
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getPostData(); }
          })
      } else {
        item.is_active = !status;
      }
    });
  }

  get selectedElements() {
    return this.dataSource.data.filter((el: PostModel) => el.checked);
  }
}
