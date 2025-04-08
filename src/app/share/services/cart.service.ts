import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {IProduct} from "../../model/model";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: BehaviorSubject<IProduct[]>;
  products:IProduct[] = [];
  constructor() {
    this.products = JSON.parse(localStorage.getItem('cart'));
    if(!this.products) {
      this.products = [];
    }
    this.cart = new BehaviorSubject<IProduct[]>(this.products);
  }
  getCart() {
    this.products = JSON.parse(localStorage.getItem('cart'));
    if(!this.products) {
      this.products = [];
    }
    return this.cart.asObservable();
  }

  pushProductToCart(product: IProduct) {
    let iProducts = this.products.filter(p => p.id == product.id);
    if(iProducts){
      product.quantity = iProducts[0]?.quantity ? iProducts[0].quantity += 1 : 1;
      this.products = this.products.filter(p => p.id != product.id);
    } else {
      product.quantity = 1;
    }
    this.products.push(product);
    localStorage.setItem('cart', JSON.stringify(this.products))
    this.cart.next(this.products);
  }
  updateProductToCart(products: IProduct[]) {
    this.products = products;
    localStorage.setItem('cart', JSON.stringify(this.products))
    this.cart.next(this.products);
  }
  popProductFromCart(product: IProduct) {
    this.products = this.products.filter(p => p.id != product.id);
    localStorage.setItem('cart', JSON.stringify(this.products))
    this.cart.next(this.products);
  }
  resetCart() {
    this.products = [];
    localStorage.removeItem('cart');
    this.cart.next(this.products);
  }
  setQuantityForProduct(product: IProduct) {
    this.products = this.products.filter(p => p.id != product.id);
    this.products.push(product);
    localStorage.setItem('cart', JSON.stringify(this.products))
    this.cart.next(this.products);
  }

}
