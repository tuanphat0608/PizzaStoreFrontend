
export interface Product {
  id: string;
  imageUrls: String[];
  relatedProduct: Product[];
  productName:string;
  stockNum:number;
  listPrice:String;
  price:String;
  warrantyTime:number;
  numberOfReplaceDay:number;
  isShipping:boolean;
  isInstallment:boolean;
  productSpecs:String;
  content:String;
  tag:String;
  numberSold:String;
  specs:Specification[];
  label:String;
  rating:number;

}
export interface Specification {
  name:String;
  value:String;
}

export interface IBestComment{
  id: string;
  name: string;
  job:string;
  avatar:string;
  comment:string;
}