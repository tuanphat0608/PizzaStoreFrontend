import {Component, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {RouterConstants} from "../../../../share/router-constants";
import {isPlatformBrowser, ViewportScroller} from '@angular/common';
import {ICategory, IProduct} from "../../../../model/model";
import {CartService} from "../../../../share/services/cart.service";
import Utils from "../../../../share/utils/utils";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  isScrolled: any = false;
  isclicked: boolean = false
  @Input()
  top4Categories: ICategory[];
  cartSub: any;
  numberProducts: number;
  selectedOption: boolean;
  @Input()
  categories: ICategory[] = [];
  @Input()
  searchCategories: ICategory[] = [];
  @Input() allCategories: ICategory[] = [];

  constructor(private router: Router,
              private cartService: CartService,
              private viewportScroller: ViewportScroller,
              @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }


  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  homePage() {
    this.router.navigate([RouterConstants.DASH_BOARD]).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onMouseLeave() {
    this.isclicked = false;
  }

  onCartClick() {
    this.router.navigate([RouterConstants.SHOPPING_CART]).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onSelectCategory(cat: ICategory) {
    if (cat.id == "13") {
      this.router.navigate(
        [RouterConstants.TIN_TUC]
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    } else if (cat.id == "12") {
      this.router.navigate(
        [RouterConstants.KHUYEN_MAI],
        {state: {category_id: cat.id}}
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    } else {
      this.router.navigate(
        [Utils.removeAccentChar(cat.full_name.toLowerCase().replaceAll(" ", "-"))],
        {
          state: {category_id: cat.id}
        }
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }

  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cartSub = this.cartService.getCart().subscribe((products: IProduct[]) => {
        this.numberProducts = products.length;
      })
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationEnd) {
      //     if (this.router.url === event.url) {
      //       location.reload();
      //     }
      //   }
      // });
    }
  }

  onOptionSelected(option: boolean) {
    this.selectedOption = option;
  }

  openAllCategory() {
    this.isclicked = !this.isclicked;
  }
}

