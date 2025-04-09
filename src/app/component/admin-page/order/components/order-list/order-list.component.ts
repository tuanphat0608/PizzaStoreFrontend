import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ConfirmDialogComponent } from '../../../common/components/confirm-dialog/confirm-dialog.component';
import { ProductModel } from '../../../common/models/product.model';
import { LoadingService } from '../../../common/services/loading.service';
import { OrderService } from '../../order.service';
import * as moment from "moment/moment";
import { OrderAddOrEditComponent } from "../order-add-or-edit/order-add-or-edit.component";
import { OrderStatus } from 'src/app/core/common.enum';
import { error } from 'console';

@Component({
  selector: 'app-product-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: false
})
export class OrderListComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'id',
    'customer',
    'phone',
    'created_date',
    'status',
    'address',
    'payment_method',
    'actions',
  ];

  public dataSource: MatTableDataSource<IOrder> =
    new MatTableDataSource<IOrder>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public keySearch: string;
  statusList: any[] = [];
  selectedStatus: string = '';
  selectedOrderStatus: OrderStatus = OrderStatus.PENDING
  role: string = ''
  constructor(private orderService: OrderService, private router: Router, private loader: LoadingService, private matDialog: MatDialog, private localStorageService: LocalStorageService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getOrderData();
    this.role = this.localStorageService.get('role');
  }

  getOrderData(keySeach?: string) {
    const loader = this.loader.show();
    this.orderService
      .getOrder({
        page: this.pageIndex,
        size: this.pageSize,
      },
        keySeach)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.totalItems = response?.totalElements;
        this.dataSource = new MatTableDataSource(response?.content || []);
        this.getUniqueStatusValues(response?.content || []);
      });
  }


  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOrderData();
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
          content: `Bạn có chắc muốn xóa <span class="highlight"><b>${item.name}</b></span> ???`
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loader = this.loader.show();
        const dataSend = []
        dataSend.push(item.id)
        this.orderService.deleteOrder(dataSend)
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getOrderData();
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
        this.orderService.deleteOrder(this.selectedElements.map((el: IOrder) => el.id))
          .pipe(finalize(() => this.loader.hide(loader)))
          .subscribe((response: any) => {
            this.getOrderData();
          });
      }
    });
  }


  onEdit(item: any) {
    const dialogRef = this.matDialog.open(OrderAddOrEditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOrderData();
      }
    })
  }

  get selectedElements() {
    return this.dataSource.data.filter((el: any) => el.checked);
  }


  onSeachChange() {
    this.pageIndex = 0;
    this.getOrderData(this.keySearch);
  }

  getStatus(status: String): String {
    var rs = "unknow";
    switch (status) {
      case "CREATED":
        return "Đơn hàng đã được tạo"
      case "CONFIRMED":
        return "Đơn hàng đã được xác nhận"
      case "SHIPPING":
        return "Đơn hàng đang vận chuyển"
      case "SHIPPED":
        return "Đơn hàng đã được bàn giao đơn vị vận chuyển"
      case "DONE":
        return "Đơn hàng đã được hoàn thành"
      case "CANCELLED":
        return "Đơn hàng đã được huỷ"

    }
    return rs;
  }

  getReturnStatus(description: string): string {
    switch (description) {
      case "Đơn hàng đã được tạo":
        return "CREATED";
      case "Đơn hàng đã được xác nhận":
        return "CONFIRMED";
      case "Đơn hàng đang vận chuyển":
        return "SHIPPING";
      case "Đơn hàng đã được bàn giao đơn vị vận chuyển":
        return "SHIPPED";
      case "Đơn hàng đã được hoàn thành":
        return "DONE";
      case "Đơn hàng đã được huỷ":
        return "CANCELLED";
      default:
        return "UNKNOWN";
    }
  }
  getUniqueStatusValues(data: any): void {
    const uniqueStatusValues = Array.from(new Set(data.map((item: any) => this.getStatus(item.status))));
    this.statusList.push(...uniqueStatusValues);
  }

  onStatusChange(): void {
    this.dataSource.filterPredicate = (item: any) => item.status === this.getReturnStatus(this.selectedStatus);
    this.dataSource.filter = this.selectedStatus;
  }

  onInitOrderData(status: OrderStatus) {
    const loader = this.loader.show();
    this.orderService
      .getOrderByStatus({
        page: this.pageIndex,
        size: this.pageSize
      }, status)
      .pipe(
        finalize(() => this.loader.hide(loader)))
      .subscribe({
        next: (response: any) => {
          this.totalItems = response?.totalElements;
          this.dataSource = new MatTableDataSource(response?.content || []);
          this.getUniqueStatusValues(response?.content || []);
        },
        error: (err: any) => {
          console.error('Failed to load orders', err);
        }
      });
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        console.log('Order updated successfully:', updatedOrder);

        this.onInitOrderData(this.selectedOrderStatus);
      },
      error: (err) => {
        console.error('Failed to update order:', err);
      }
    });
  }

  protected readonly moment = moment;


}
