import { CategoryModel } from "./category.model";
import {IImageInfo} from "../../../../model/model";

export interface ProductModel {
  id: string;
  name: string;
  price: string;
  priceFormatted: string;
  listPrice: string;
  listPriceFormatted: string;
  stock: number;
  label: string;
  category: CategoryModel;
  images: IImageInfo[];
  number_sold: number;
  is_installment_support: boolean;
  is_shipment_support: boolean;
  is_active: boolean;
  product_size: number;
}

export interface ChangeStatusPostModel {
  bulkEdits: StatusModel[];
}

export interface StatusModel {
  id?: string;
  isActive?: boolean;
  status?: string;
}
