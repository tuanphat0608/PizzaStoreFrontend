import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RouterConstants } from 'src/app/share/router-constants';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../../common/services/loading.service';
import { QuestionService } from '../../question.service';
import { QuestionAddOrEditComponent } from '../question-add-or-edit/question-add-or-edit.component';
import {IGenericProduct, IQuestion} from "../../../../../model/model";
import {QuickNewDialogComponent} from "../../../common/components/quick-add-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'product_name',
    'name',
    'phone',
    'email',
    'question',
    'actions',
  ];

  public dataSource: MatTableDataSource<IGenericProduct> =
    new MatTableDataSource<IGenericProduct>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public isActiveFilter: boolean = false;

  constructor(
    private toastr: ToastrService,
    private questionService: QuestionService,
    private router: Router,
    private matDialog: MatDialog,
    private loader: LoadingService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getQuestionData();
  }

  getQuestionData() {
    const loader = this.loader.show();
    this.questionService
      .getQuestion({
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
    this.getQuestionData();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getQuestionData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.checked = event));
  }

  onCheckChange() {
    this.isAllChecked =
      this.dataSource.data.length == this.selectedElements.length;
  }

  onDelete(item: IGenericProduct) {
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
        this.questionService.deleteQuestion([item.question.id])
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getQuestionData();
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
        this.questionService.deleteQuestion(this.selectedElements.map((el: IGenericProduct) => el.question.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getQuestionData();
          });
      }
    });
  }

  onAddNew() {
    const dialogRef = this.matDialog.open(QuestionAddOrEditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestionData();
      }
    })
  }

  onEdit(item: IGenericProduct) {
    const dialogRef = this.matDialog.open(
      QuickNewDialogComponent,
      {
        width: '600px',
        height: 'auto',
        data: item.question.question
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.question.question = result;
        //add new
        this.questionService.updateQuestion(item.question).subscribe({
          next: brand => {
            this.toastr.success('Cập nhật thành công');
            this.getQuestionData();
          },
          error: error => {
            this.toastr.error('Cập nhật không thành công');
          }
        })
      }
    });
  }


  onChangeStatus(status: boolean, item: IGenericProduct) {
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
        this.questionService.changeStatus({ bulkEdits: [{ id: item.question.id, isActive: status }] })
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getQuestionData(); }
          })
      }
    });
  }

  onHideMultipleQuestion() {
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
        this.questionService.hideQuestion(this.selectedElements.map((el: any) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe(res => {
            if (res) { this.getQuestionData(); }
          })
      }
    });
  }
  get selectedElements() {
    return this.dataSource.data.filter((el: IGenericProduct) => el.question.checked);
  }
}
