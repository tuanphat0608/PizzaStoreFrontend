import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from './order.service';
import * as moment from "moment/moment";
import { OrderStatus } from 'src/app/core/common.enum';
import { FoodOrder } from 'src/app/model/model';
import { LoadingService } from '../common/services/loading.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';

@Component({
  selector: 'order-list',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'phoneNumber', 'address', 'price', 'createdTime', 'status', 'actions'];
  public dataSource: MatTableDataSource<FoodOrder> =
    new MatTableDataSource<FoodOrder>([]);
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public keySearch: string;
  statusList: OrderStatus[] = [];
  selectedStatus: string = '';
  selectedOrderStatus: OrderStatus = OrderStatus.ALL
  role: string = ''
  OrderStatus = OrderStatus;
  orderStatuses: string[] = Object.values(OrderStatus);
  constructor(private orderService: OrderService, private router: Router, private loader: LoadingService, private matDialog: MatDialog, private localStorageService: LocalStorageService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.onInitOrderData(this.selectedOrderStatus);
    this.role = this.localStorageService.get('role');
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
