import { CategoryModel } from "./category.model";
import { ImageInfo } from "./image-info.model";

export interface PostModel {
  id: string;
  title: string;
  content: string;
  view: number;
  category: CategoryModel;
  is_active: boolean;
  is_system: boolean;
  created_date: string;
  image_info: ImageInfo;
  checked: boolean;
}

export interface ChangeStatusPostModel {
  bulkEdits: StatusModel[];
}

export interface StatusModel {
  id: string;
  isActive: boolean;
}