import { ViewportScroller,Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants } from 'src/app/share/router-constants';
import { ProductService } from 'src/app/share/services/product.service';
import Utils from '../../../../../share/utils/utils';
import {forkJoin} from "rxjs";
import {NewsService} from "../../../../../share/services/news.service";

interface AutocompleteSection {
  title: string;
  options: any[];
}
@Component({
  selector: 'app-autocompelte',
  templateUrl: './autocompelte.component.html',
  styleUrls: ['./autocompelte.component.scss'],
})
export class AutocompelteComponent {
  @Output() optionSelected = new EventEmitter<boolean>();
  isInputFocused: boolean = false;

  userInput: string = '';
  constructor(
    private router: Router,
    private productService: ProductService,
    private newsService: NewsService,
    private viewportScroller: ViewportScroller,
    private location: Location,
    private el: ElementRef,
  ) {
    let state = location.getState();
    // @ts-ignore
     this.userInput = state?.['searchResult'] || state?.['product_name'];
     // this.onUserInputChange();
  }
  isFocused: boolean = false;

  onInputFocus() {
    this.isInputFocused = true;
    this.optionSelected.emit(this.isInputFocused);

  }

  // Example method for updating isInputFocused
  onInputBlur(event: Event) {
    // Introduce a small delay before updating isInputFocused to false
    setTimeout(() => {
      if (!this.el.nativeElement.contains(document.activeElement)) {
        this.isInputFocused = false;
        this.optionSelected.emit(this.isInputFocused);
      }
    }, 200); // Adjust the delay as needed
  }
  filterOptions(event: any): AutocompleteSection[] {
    this.userInput = event.target.value;
    return this.sections
      .map((section) => ({
        title: section.title,
        options: section.options.filter((option) =>
          option.name.toLowerCase().includes(this.userInput.toLowerCase())
        ),
      }))
      .filter((section) => section.options.length > 0);
  }

  onSelectOption(section: string, option: any): void {
    this.userInput = option.name;
    this.router
      .navigate(
        [
          RouterConstants.DASH_BOARD,
          RouterConstants.PRODUCT_DETAIL,
          Utils.removeAccentChar(
            option.name.replaceAll(' ', '-').replaceAll('\n', '')
          ),
        ],
        { state: { product_id: option.id , product_name : option.name} }
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
  sections: AutocompleteSection[] = [
    {
      title: 'Gợi ý kết quả',
      options: [],
    },
    {
      title: 'Bài viết liên quan',
      options: [],
    },
  ];
  onUserInputChange() {
    forkJoin([this.productService.getListProduct(this.userInput),this.newsService.getListNews(this.userInput)]).subscribe(data => {
      if (data[0] != null) {
        this.sections[0].options =
        data[0].content.slice(0,3);
      }
      if (data[1] != null) {
        this.sections[1].options =
        data[1].content.slice(0,3);
      }
    });
  }
  searchProduct(){

    this.router.navigate(
      [RouterConstants.TIM_KIEM,this.userInput],
      { state: { searchResult: this.userInput } }
    ).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
}

  onSelectNewsOption(title: string, option: any) {
    this.router
      .navigate(
        [
          RouterConstants.DASH_BOARD,
          RouterConstants.TIN_TUC,
          Utils.removeAccentChar(
            option.title.replaceAll(' ', '-').replaceAll('\n', '')
          ),
        ],
        { state: { news_id: option.id} }
      )
      .then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  getDisplayPrice(product: any): number {
    if(product.price && product.price != 0) {
      return product.price;
    }
    if(product.price12 && product.price12 != 0) {
      return product.price12;
    }
    if(product.price18 && product.price18 != 0) {
      return product.price18;
    }
    return product.listPrice;
  }
}
