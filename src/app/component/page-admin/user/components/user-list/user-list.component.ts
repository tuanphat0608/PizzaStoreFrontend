import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../../common/services/loading.service';
import {  UserService } from '../../user.service';
import { UserAddOrEditComponent } from '../user-add-or-edit/user-add-or-edit.component';
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'username',
    'role',
    'actions',
  ];

  public dataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public isActiveFilter: boolean = false;

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    const loader = this.loader.show();
    this.userService
      .getUser({
        page: 0,
        size: 1000,
        sort: ''
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
    this.getUserData();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUserData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

 
  onDeleteMultiple() {

    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn xóa những user đã chọn ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        // this.userService.deleteUser(this.selectedElements.map((el: any[]) => el.name))
        //   .pipe(finalize(() => this.loader.hide(loader)))
        //   .subscribe((response: any) => {
        //     this.getUserData();
        //   });
      }
    });
  }

  onAddNew() {
    const dialogRef = this.matDialog.open(UserAddOrEditComponent, {
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      // width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserData();
      }
    })
  }

  onEdit(item: any) {
    const dialogRef = this.matDialog.open(
      UserAddOrEditComponent,
      {
        width: '600px',
        height: 'auto',
        data: item
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //add new
     
            this.toastr.success('Cập nhật thành công');
            this.getUserData();

          }else{
            this.toastr.error('Cập nhật không thành công');
            this.getUserData();


          }
          
        
      
    });
  }


  resetPassword( item: any) {
    const dialogRef = this.matDialog.open(
      ConfirmDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: {
          content: `Bạn có chắc muốn reset mật khẩu của người dùng này không ?`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        this.userService.resetPassword(item.username)
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((res: any) => {
            if (res) {
              this.toastr.success('Reset thành công'); 
              this.getUserData(); }
          })
      }
    });
  }

 
  get selectedElements() {
    return this.dataSource.data.filter((el: any) => el.checked);
  }
}
