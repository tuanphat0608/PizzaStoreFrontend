import { Crust, OrderStatus, Size } from "../core/common.enum";

export interface Pizza{
  id: string,
  name: string,
  description: string,
  crust: Crust,
  size: Size,
  price: number,
  image_url: string
}

export interface Drink{
  id: string,
  name: string,
  description: string,
  price: number,
  image_url: string
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
  phone_number: string,
  delivery_address: string,
  pizzas: PizzaOrder[],
  drinks: DrinkOrder[],
  status?: OrderStatus,
  createdTime?: Date,
  totalPrice?: number
}
