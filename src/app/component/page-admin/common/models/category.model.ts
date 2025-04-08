import { ImageInfo } from "./image-info.model";
import { ProductModel } from "./product.model";

export interface CategoryModel {
  id: string;
  name: string;
  content: string;
  full_name: string;
  created_date: string;
  image_info: ImageInfo;
  priority:number;
  avatar: ImageInfo;
  advertise_image: ImageInfo;
  advertise_image_mobile: ImageInfo;
  is_advertise: boolean;
  is_popular: boolean;
  is_show_in_dashboard: boolean;
  parent_id: string;
  is_active: boolean;
  checked: boolean;
  listProducts: ProductModel[];
}


export interface AssignProductDTO {
  categoryId: string;
  listProducts: string[];
}

export interface ChangeStatusPostModel {
  bulkEdits: StatusModel[];
}

export interface StatusModel {
  id: string;
  isActive: boolean;
}
