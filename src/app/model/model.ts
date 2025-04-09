import { Crust, OrderStatus, Size } from "../core/common.enum";

export interface Pizza{
  id: string,
  name: string,
  description: string,
  crust: Crust,
  size: Size,
  price: number
}

export interface Drink{
  id: string,
  name: string,
  description: string,
  price: number
}

export interface DrinkOrder{
  drink: Drink,
  quantity: number
}

export interface PizzaOrder{
  pizza: Pizza,
  quantity: number
}


export interface FoodOrder{
  id?: string,
  name: string,
  phoneNumber: string,
  deliveryAddress: string,
  pizzas: PizzaOrder[],
  drinks: DrinkOrder[],
  status?: OrderStatus,
  createdTime?: Date,
  totalPrice?: number
}
