import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../common/services/loading.service';
import { CategoryModel } from '../../../common/models/category.model';
import { OrderService } from "../../order.service";
import { IOrder, IOrderDetail } from "../../../../../model/model";
import * as moment from "moment/moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-post-add-or-edit',
  templateUrl: './order-add-or-edit.component.html',
  styleUrls: ['./order-add-or-edit.component.scss'],
  standalone: false
})
export class OrderAddOrEditComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  avatar: string = '';
  categoryList: Array<CategoryModel> = [];
  quillEditorModules: any;
  order: IOrder;
  html = '';
  totalPrice: number = 0;
  protected readonly moment = moment;

  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'images',
    'name',
    'warranty_type',
    'quantity',
    'price',
    'total_price',
  ];
  public dataSource: MatTableDataSource<IOrderDetail> =
    new MatTableDataSource<IOrderDetail>([]);
  selectedStatus: any;
  orderStatus: any = [
    'CREATED',
    'CONFIRMED',
    'SHIPPING',
    'SHIPPED',
    'DONE',
    'CANCELLED'
  ];
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<OrderAddOrEditComponent>,
    private loader: LoadingService
  ) {
    this.order = dialogData;
    this.selectedStatus = this.order.status;
    this.dataSource = new MatTableDataSource(this.order.product_order_list || []);

    if (this.order.product_order_list) {
      for (let orderdetail of this.order.product_order_list) {
        let selectedPrice: number = 0;
        switch (orderdetail.warranty_type) {
          case 1: {
            if (orderdetail.product.price && orderdetail.product.price != 0)
              selectedPrice = orderdetail.product.price
            break;
          }
          case 12: {
            if (orderdetail.product.price12 && orderdetail.product.price12 != 0)
              selectedPrice = orderdetail.product.price12
            break;
          }
          case 18: {
            if (orderdetail.product.price18 && orderdetail.product.price18 != 0)
              selectedPrice = orderdetail.product.price18
            break;
          }
          default: {
            selectedPrice = orderdetail.product.listPrice
            break;
          }
        }
        this.totalPrice += (selectedPrice * orderdetail.quantity);
      }
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
  }

  onSave() {
    const loader = this.loader.show();
    this.orderService.changeStatus({ bulkEdits: [{ id: this.order.id, status: this.order.status }] })
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe({
        next: res => {
          if (res) {
            this.toastr.success('Cập nhật thành công');
          }
        },
        error: error => {
          this.toastr.error('Lỗi');
        }
      });
  }

  selectOrderStatus(status: any) {
    this.order.status = status;
    this.selectedStatus = status;
  }

  getStatus(status: String): String {
    var rs = "unknow";
    switch (status) {
      case "CREATED":
        return "Đơn hàng đã được tạo"
      case "CONFIRMED":
        return "Đơn hàng đã được xác nhận"
      case "SHIPPING":
        return "Đơn hàng đang được vận chuyển"
      case "SHIPPED":
        return "Đơn hàng đã được bàn giao đơn vị vận chuyển"
      case "DONE":
        return "Đơn hàng đã được hoàn thành"
      case "CANCELLED":
        return "Đơn hàng đã được huỷ"
    }
    return rs;
  }

  getSelectedPrice(orderDetail: IOrderDetail): number {
    let selectedPrice: number = 0;
    switch (orderDetail.warranty_type) {
      case 1: {
        if (orderDetail.product.price && orderDetail.product.price != 0)
          return orderDetail.product.price
        break;
      }
      case 12: {
        if (orderDetail.product.price12 && orderDetail.product.price12 != 0)
          return orderDetail.product.price
        break;
      }
      case 18: {
        if (orderDetail.product.price18 && orderDetail.product.price18 != 0)
          return orderDetail.product.price
        break;
      }
      default: {
        selectedPrice = orderDetail.product.listPrice
        break;
      }
    }
    return selectedPrice;
  }
}
