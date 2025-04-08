import { ViewportScroller,Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { INews, IProduct } from 'src/app/model/model';
import { ProductService } from 'src/app/share/services/product.service';

@Component({
  selector: 'app-list-product-seen',
  templateUrl: './list-product-seen.component.html',
  styleUrls: ['./list-product-seen.component.scss']
})
export class ListProductSeenComponent implements OnInit {
  listProducts: IProduct[] = []; 
  categoryname : string;
  advertiseCategories: { img: string }[] = [
    { img: 'https://phonghoa.vn/wp-content/uploads/2023/06/May-rua-bat-khu-trung-Xiaomi-Mijia.jpg' },
    { img: 'https://phonghoa.vn/wp-content/uploads/2023/06/May-rua-bat-khu-trung-Xiaomi-Mijia.jpg' },
    { img: 'https://phonghoa.vn/wp-content/uploads/2023/06/May-rua-bat-khu-trung-Xiaomi-Mijia.jpg' }
  ];
  constructor(private router: Router,
    private productService: ProductService,private viewportScroller : ViewportScroller,private location: Location
) {
  this.productService.getListSeen().subscribe((seenProducts: IProduct[]) => {
    if (seenProducts.length > 0) {
      // Remove duplicates based on the 'id' property
      const seenProductsFiltered = seenProducts.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );
  
      this.listProducts = seenProductsFiltered;
    }
  });
}
 
ngOnInit(): void {
  // Subscribe to changes in the list of seen products
}

// Example method to add a new product to the list
addProductToList(newProduct: IProduct): void {
  this.productService.addListSeen(newProduct);
}

private filterUniqueProducts(seenProducts: IProduct[]): IProduct[] {
  // Use a Set to keep track of unique product ids
  const uniqueProductIds = new Set<string>();

  // Filter out duplicates based on product id
  return seenProducts.filter((product) => {
    if (!uniqueProductIds.has(product.id)) {
      uniqueProductIds.add(product.id);
      return true;
    }
    return false;
  });
}

}

