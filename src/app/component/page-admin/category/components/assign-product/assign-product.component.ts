import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { CategoryModel } from '../../../common/models/category.model';
import { ProductModel } from '../../../common/models/product.model';
import { LoadingService } from '../../../common/services/loading.service';
import { ProductService } from '../../../product/product.service';
import { CategoryService } from '../../category.service';
import { MatPaginator } from '@angular/material/paginator';
import { BaseSearchModel } from '../../../common/models/base.model';

@Component({
  selector: 'app-assign-product',
  templateUrl: './assign-product.component.html',
  styleUrls: ['./assign-product.component.scss']
})
export class AssignProductComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'image_info',
    'name',
    'stock'
  ];
  public dataSource: MatTableDataSource<ProductModel> =
    new MatTableDataSource<ProductModel>([]);
  public isAllChecked: boolean = false;
  public totalItems: number = 0;

  public pagingOption: BaseSearchModel = {
    page: 0,
    size: 10,
    keySearch: null
  };
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public keySearch: string;

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router, private loader: LoadingService,
    private dialogRef: MatDialogRef<AssignProductComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CategoryModel) { }

  ngOnInit() {
    this.getProductData();
  }

  getProductData(keySearch?: string) {
    this.pagingOption = {
      page: this.pageIndex,
      size: this.pageSize,
      keySearch: keySearch
    }
    const loader = this.loader.show();
    this.categoryService
      .searchProductToAssign(this.pagingOption, this.dialogData.id)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.totalItems = response?.pageProducts.totalElements;
        this.dataSource = new MatTableDataSource(response?.pageProducts.content || []);
        this.isAllChecked = this.dataSource.data.length == this.selectedElements.length;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getProductData();
  }

  onCheckAll(event: any) {
    this.isAllChecked = event;
    this.dataSource.data.map((el: any) => (el.is_assigned = event));
  }

  onCheckChange() {
    this.isAllChecked = this.dataSource.data.length == this.selectedElements.length;
  }

  onSave() {
    const loader = this.loader.show();
    this.categoryService.assignProduct(
      this.dialogData.id,
      this.selectedElements.map(el => el.id)
    )
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe(response => {
        if (response) {
          this.dialogRef.close(true);
        }
      });
  }

  get selectedElements() {
    return this.dataSource.data.filter((el: any) => el.is_assigned);
  }

  onSeachChange() {
    this.pageIndex = 0;
    this.getProductData(this.keySearch);
  }

}
