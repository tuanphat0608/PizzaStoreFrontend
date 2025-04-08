import {ImageFile} from "./image-file";

export interface INews{
  id:string;
  title: string;
  content : string;
  view : number;
  image_info: IImageInfo,
  created_date:Date;
  created_date_formatted:string;
}

export interface ISetting{
  url_banner: string,
  url_video : string,
  banner_image : IImageInfo
  banner_image_mobile : IImageInfo
}
export interface ICategory{
  id: string,
  name:string,
  full_name : string,
  content : string,
  product_size : number,
  image_info: IImageInfo,
  listProducts: IProduct[],
  listBrands: IProduct[],
  advertise_image_mobile:IImageInfo,
  advertise_image:IImageInfo,
  avatar:IImageInfo,
  is_advertise:boolean,
  is_popular:boolean,
  is_active:boolean,
  is_show_in_dashboard:boolean,

}
export interface ICustomer{
  id?: string,
  name:string,
  gender? : string,
  phone : string,
  email : string,
  address? : string,
  city? : string,
  state? : string,
  country? : string,
}
export interface IOrderDetail{
  id?: string,
  product: IProduct,
  quantity : number,
  warranty_type? : number,
}
export interface IOrder{
  id?:string,
  created_date?: string,
  status: string,
  city: string,
  district: string,
  ward: string,
  address: string,
  payment_method: string,
  product_order_list: IOrderDetail[]
  customer: ICustomer,
  is_received_in_store:boolean;
}
export interface IProduct{
  id: string,
  name:string,
  brand : IBrand;
  categories: ICategory[],
  description:string,
  specification:string,
  label:string,
  category_id:string,
  category_name:string,
  brand_id:string,
  brand_name:string,
  promotion_description:string,
  quantity: number,
  price: number,
  price6: number,
  price12: number,
  price15: number,
  price18: number,
  price24: number,
  listPrice: number,
  priceFormatted: string,
  listPriceFormatted: string,
  stock: number,
  warranty: number,
  warranty_type: number,
  rating: number,
  number_sold: number,
  numberLeft: number,
  number_of_replace_day: number,
  product_type: string,
  is_installment_support: boolean,
  is_shipment_support: boolean,
  images: IImageInfo[],
  productTags: IProductTag[],
  specifications: ISpecification[],
  related_products: IRelatedProduct,
  selectedPrice?: number,
  noWarranty?: boolean,
  reviews: IReview[],
  questions: IQuestion[],
  created_date:Date,
  modified_date:Date,
}
export interface IRelatedProduct{
  product_size: number,
  relatedProducts:IProduct[]
}

export interface IImageInfo{
  id: string,
  path:string
}export interface IBrand{
  id?: string,
  name:string,
  listProducts?:IProduct[],
}
export interface IProductTag{
  id: string,
  name:string
}
export interface ISpecification{
  id: string,
  key:string,
  value:string
}

export interface IGenericProduct {
  product_id: string,
  question:IQuestion,
  review:IReview,
  product_name:string,
}

export interface IQuestion{
  id: string,
  question:string,
  name:string,
  phone:string,
  email:string,
  is_active:boolean,
  created_date:Date,
  modified_date: Date,
  checked: boolean
  answer: IAnswer[];
}

export interface IAnswer{
  id: string,
  question:string,
  name:string,
  is_active:boolean,
  created_date:Date,
}

export interface IReview{
  id: string,
  customer_name:string,
  customer_email:string,
  job_name:string,
  content:string,
  avatar:IImageInfo,
  rating_point: number,
  is_remember_me: boolean,
  is_dashboard: boolean,
  is_active: boolean,
  checked?: boolean,
  created_date: Date,
  modified_date: Date,
  image_list: IImageInfo[],
}

export interface IDropdownOption{
  id:number,
  value:string
}
