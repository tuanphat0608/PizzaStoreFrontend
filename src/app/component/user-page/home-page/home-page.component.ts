
import { Router } from '@angular/router';
import { Drink, DrinkOrder, FoodOrder, Pizza, PizzaOrder } from "../../../model/model";
import { ProductService } from "../../../share/services/product.service";
import { finalize } from "rxjs";
import { LoadingService } from '../../admin-page/common/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../admin-page/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { QuantityDialogComponent } from '../quantity-dialog/quantity-dialog.component';

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
  combinedOrders: { name: string; quantity: number; price: number }[] = [];
  totalPrice: number = 0;
  displayedColumns: string[] = ['index', 'item', 'quantity', 'price'];

  constructor(private router: Router,
    private loader: LoadingService,
    private productService: ProductService,
    private orderService: OrderService,
    private dialog: MatDialog
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

  openQuantityDialog(item: PizzaOrder | DrinkOrder, type: 'pizza' | 'drink') {
    const itemName = type === 'pizza' ? (item as PizzaOrder).pizza.name : (item as DrinkOrder).drink.name;

    const dialogRef = this.dialog.open(QuantityDialogComponent, {
      width: '250px',
      data: {
        itemName,
        quantity: item.quantity || 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && typeof result === 'number') {
        item.quantity = result;
        this.updateOrderReview(); // 👈 update total & combined list
      }
    });
  }


  updateOrderReview() {
    this.combinedOrders = [];

    this.pizzaOrders.forEach(p => {
      if (p.quantity > 0) {
        this.combinedOrders.push({
          name: p.pizza.name,
          quantity: p.quantity,
          price: p.pizza.price
        });
      }
    });

    this.drinkOrders.forEach(d => {
      if (d.quantity > 0) {
        this.combinedOrders.push({
          name: d.drink.name,
          quantity: d.quantity,
          price: d.drink.price
        });
      }
    });

    this.totalPrice = this.combinedOrders.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }


}
