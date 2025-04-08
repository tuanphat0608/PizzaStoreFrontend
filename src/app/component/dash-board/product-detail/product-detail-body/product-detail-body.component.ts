import {Component, HostListener, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Product} from "../../../../model/product";
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService} from '../../breadcrumb/breadcrumb.service';
import {IImageInfo, IProduct} from "../../../../model/model";
import {CartService} from "../../../../share/services/cart.service";
import {RouterConstants} from "../../../../share/router-constants";
import {ViewportScroller} from "@angular/common";
import {ProductService} from 'src/app/share/services/product.service';
import {Carousel} from 'primeng/carousel';
import {ImageInfo} from "../../../page-admin/common/models/image-info.model"; // Import the Carousel component from PrimeNG
import {ImagePreviewComponent} from './image-preview/image-preview.component'; // Create this component in the next step
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail-body',
  templateUrl: './product-detail-body.component.html',
  styleUrls: ['./product-detail-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailBodyComponent implements OnInit {
  isExpand: boolean;
  @ViewChild('carousel') carousel: Carousel; // Use the actual type from your carousel library
  dynamicHtmlContent: string;
  warrantyLabel: string;

  @Input()
  salePercent: number;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private productService: ProductService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.onResize();

  }

  expandStyles = {
    height: 'auto',  // Apply styles when isExpand is true
    overflow: 'auto',
  };

  collapseStyles = {
    'max-height': '1140px',
    overflow: 'hidden',
  };

  expandOrCollapse() {
    this.isExpand = !this.isExpand;
  }

  @Input()
  product: IProduct;
  @Input()
  productSuggest: IProduct[];
  @Input()
  averageStar: number = 0
  @Input()
  value5Star: number = 0;
  @Input()
  value4Star: number = 0;
  @Input()
  value3Star: number = 0;
  @Input()
  value2Star: number = 0;
  @Input()
  value1Star: number = 0;
  @Input() listImg: IImageInfo[] = []
  activeIndex = 0; // Keep track of the active index
  handleImageClick(index: number) {
    this.activeIndex = index
  }

  selectedPrice: number = 0;
  noWarranty: boolean = false;
  selectedWarranty: number = 1;

  ngOnInit(): void {
    if (this.product) {
      this.productService.addListSeen(this.product);
      this.listImg = this.product?.images;
      this.selectedPrice = this.product?.listPrice;
      this.noWarranty = true;
      if (this.product?.price24 && this.product?.price24 != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 24;
        this.selectedPrice = this.product.price24
        this.warrantyLabel = "24"
      }
      if (this.product?.price18 && this.product?.price18 != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 18;
        this.selectedPrice = this.product.price18
        this.warrantyLabel = "18"
      }
      if (this.product?.price15 && this.product?.price15 != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 15;
        this.selectedPrice = this.product.price15
        this.warrantyLabel = "15"
      }
      if (this.product?.price12 && this.product?.price12 != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 12;
        this.selectedPrice = this.product.price12
        this.warrantyLabel = "12"
      }
      if (this.product?.price6 && this.product?.price6 != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 6;
        this.selectedPrice = this.product.price6
        this.warrantyLabel = "6"
      }
      if (this.product?.price && this.product?.price != 0) {
        this.noWarranty = false;
        this.selectedWarranty = 1;
        this.selectedPrice = this.product.price
        this.warrantyLabel = "1"
      }
      this.salePercent = (1 - (this.selectedPrice / this.product.listPrice)) * 100
      console.log(this.noWarranty)

    }

    this.dynamicHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.product?.description) as string;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
  }

  getRating() {
    return this.product.rating ? this.product.rating : 0;
  }

  onAddToCartClick(product: IProduct) {
    product.warranty_type = this.selectedWarranty;
    this.cartService.pushProductToCart(product)
  }

  onBuyNowClick(product: IProduct) {
    product.warranty_type = this.selectedWarranty;
    this.cartService.pushProductToCart(product)
    this.router.navigate([RouterConstants.SHOPPING_CART]).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onWarrantyChange($event: any) {
    this.selectedWarranty = Number.parseInt($event)
    this.selectedPrice = this.product.listPrice;
    switch (this.selectedWarranty) {
      case 1: {
        if (this.product.price && this.product.price != 0)
          this.selectedPrice = this.product.price
        this.warrantyLabel = "1"
        console.log("1")
        break;
      }
      case 6: {
        if (this.product.price6 && this.product.price6 != 0)
          this.selectedPrice = this.product.price6
        this.warrantyLabel = "6"
        break;
      }
      case 12: {
        if (this.product.price12 && this.product.price12 != 0)
          this.selectedPrice = this.product.price12
        this.warrantyLabel = "12"
        break;
      }
      case 15: {
        if (this.product.price15 && this.product.price15 != 0)
          this.selectedPrice = this.product.price15
        this.warrantyLabel = "15"
        break;
      }
      case 18: {
        if (this.product.price18 && this.product.price18 != 0)
          this.selectedPrice = this.product.price18
        this.warrantyLabel = "18"
        break;
      }
      case 24: {
        if (this.product.price24 && this.product.price24 != 0)
          this.selectedPrice = this.product.price24
        this.warrantyLabel = "24"
        break;
      }
    }
    this.salePercent = (1 - (this.selectedPrice / this.product.listPrice)) * 100
  }

  openImagePreview(img: any) {
    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      data: {imagePath: img},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
