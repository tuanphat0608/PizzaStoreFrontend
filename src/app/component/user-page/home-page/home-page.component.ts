
import {Router} from '@angular/router';
import {Drink, DrinkOrder, FoodOrder, Pizza, PizzaOrder} from "../../../model/model";
import {ProductService} from "../../../share/services/product.service";
import {finalize} from "rxjs";
import { LoadingService } from '../../admin-page/common/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../admin-page/order/order.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: false
})

export class HomePageComponent implements OnInit {
  public pageSize: number = 10;
  public pageIndex: number = 0;
  availablePizzas: Pizza[] = [];
  availableDrinks: Drink[] = [];
  pizzaOrders: PizzaOrder[] = [];
  drinkOrders: DrinkOrder[] = [];
  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';

  constructor(private router: Router,
              private loader: LoadingService,
              private productService: ProductService,
              private orderService: OrderService
  ) {
  }

  ngOnInit() {
    this.getPizzas();
    this.getDrinks();
  }

  getDrinks() {
    const loader = this.loader.show();
    this.productService
      .getDrinks({
        page: this.pageIndex,
        size: this.pageSize,
      })
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.availableDrinks = response?.content || [];
      });
  }

  getPizzas() {
    const loader = this.loader.show();
    this.productService
      .getPizzas({
        page: this.pageIndex,
        size: this.pageSize,
      })
      .pipe(finalize(() => this.loader.hide(loader)))
      .subscribe((response: any) => {
        this.availablePizzas = response?.content || [];
      });
  }

  submitOrder() {
    const filteredPizzaOrders = this.pizzaOrders.filter(po => po.quantity > 0);
    const filteredDrinkOrders = this.drinkOrders.filter(do_ => do_.quantity > 0);

    const order: FoodOrder = {
      name: this.customerName,
      phoneNumber: this.customerPhone,
      deliveryAddress: this.customerAddress,
      pizzas: filteredPizzaOrders,
      drinks: filteredDrinkOrders
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        console.log('Order created successfully:', res);
      },
      error: (err) => {
        console.error('Failed to create order:', err);
      }
    });
  }  

}
