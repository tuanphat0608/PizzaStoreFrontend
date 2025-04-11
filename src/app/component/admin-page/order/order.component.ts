import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from './order.service';
import * as moment from "moment/moment";
import { OrderStatus, Role } from 'src/app/core/common.enum';
import { FoodOrder } from 'src/app/model/model';
import { LoadingService } from '../common/services/loading.service';
import { LocalStorageService } from 'src/app/share/services/storage.service';
import { PermisisonService } from 'src/app/share/services/permisison.service';

@Component({
  selector: 'order-list',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['orderNumber', 'date', 'items', 'name', 'phoneNumber', 'price', 'actions'];
  public dataSource: MatTableDataSource<FoodOrder> =
    new MatTableDataSource<FoodOrder>([]);
  public totalItems: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public keySearch: string;
  statusList: OrderStatus[] = [];
  selectedStatus: string = '';
  selectedOrderStatus: OrderStatus
  role: string = ''
  OrderStatus = OrderStatus;
  orderStatuses: string[] = Object.values(OrderStatus);
  constructor(
    private orderService: OrderService, 
    private router: Router, 
    private loader: LoadingService, 
    private matDialog: MatDialog, 
    private localStorageService: LocalStorageService,
    private authService: PermisisonService) {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit() {
    const userDataRaw = localStorage.getItem('userData');
    if (!userDataRaw) {
      this.router.navigate(['/admin/login']);
      return;
    }
  
    let userData: any;
    try {
      userData = JSON.parse(userDataRaw);
    } catch (e) {
      console.error('Failed to parse userData from localStorage:', e);
      this.router.navigate(['/admin/login']);
      return;
    }
  
    const token = userData?._token;
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }
  
    this.authService.checkToken(token).subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/admin/login']);
        } else {
          this.initializeComponent();
        }
      },
      error: (err) => {
        console.error('Token validation failed:', err);
        this.router.navigate(['/admin/login']);
      }
    });
  }
  

  private initializeComponent(): void {
    const storedRole = localStorage.getItem('role')?.replace(/"/g, '') as Role;
    if (Object.values(Role).includes(storedRole as Role)) {
      this.role = storedRole as Role;
    }
    this.setStatusByRole();
    this.onInitOrderData(this.selectedOrderStatus);
  }  

  setStatusByRole(): void {
    switch (this.role) {
      case Role.RECEPTIONIST:
        this.selectedOrderStatus = OrderStatus.PENDING;
        break;
      case Role.CHEF:
        this.selectedOrderStatus = OrderStatus.CONFIRMED;
        break;
      case Role.DELIVERY:
        this.selectedOrderStatus = OrderStatus.COOKED;
        break;
      default:
        this.selectedOrderStatus = OrderStatus.ALL;
    }
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

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onInitOrderData(this.selectedOrderStatus);
  }



}
