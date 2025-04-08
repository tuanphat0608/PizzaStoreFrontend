import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AssignProductComponent } from '../../../category/components/assign-product/assign-product.component';
import { BaseSearchModel } from '../../../common/models/base.model';
import { CategoryModel } from '../../../common/models/category.model';
import { ProductModel } from '../../../common/models/product.model';
import { LoadingService } from '../../../common/services/loading.service';
import { FlashsaleService } from '../../../flashsale/flashsale.service';
import { ProductService } from '../../../product/product.service';
import { IProduct } from 'src/app/model/model';

@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss']
})
export class GetProductComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  public displayedColumns: string[] = [
    'check',
    'image_info',
    'name',
    'stock'
  ];
  public getproduct: IProduct;
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
    private categoryService: FlashsaleService,
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
    this.productService
      .getProduct(this.pagingOption,keySearch)
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.totalItems = response?.totalElements;
        this.dataSource = new MatTableDataSource(response?.content || []);
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

  selectedRow: any; // Use the appropriate type for your data

  onCheckChange(selectedElement: any) {
    this.getproduct= selectedElement
  }

  onSave() {
    this.dialogRef.close(this.getproduct);

  }

  get selectedElements() {
    return this.dataSource.data.filter((el: any) => el.is_assigned);
  }

  onSeachChange() {
    this.pageIndex = 0;
    this.getProductData(this.keySearch);
  }

}
