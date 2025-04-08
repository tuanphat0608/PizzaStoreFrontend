import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/share/services/product.service';
import { ViewportScroller,Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { INews, IProduct } from 'src/app/model/model';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  listProducts: IProduct[] = null;
  listNews: INews[] =[]// Assuming IProduct is your interface for products
  specsValues:string[];
  userInput:string;
  constructor(private router: Router,private route: ActivatedRoute,
    private productService: ProductService,private viewportScroller : ViewportScroller,private location: Location
) {
  this.userInput = this.route.snapshot.paramMap.get('search');
  this.productService.updateStringValue(this.userInput);
  this.productService.getListProduct(this.userInput).subscribe(data => {
    this.listProducts =  data.content;
  });
}
  ngOnInit(): void {

    }

}
