import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/product.model';
import { IImageInfo, IProduct } from "../../../model/model";
import { BaseSearchModel } from '../common/models/base.model';
import { CoreUrl } from 'src/app/share/constant/url.constant';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) { }

  getProduct(options: any, search?: string) {
    return this.http.get(
      `/api/v1/product`,
      {
        params: {
          page: options.page,
          size: options.size,
          isActive: "",
          name: search || ""
        }
      }
    );
  }
  getRelatedProduct(id: string , pagingOption : BaseSearchModel){
    const params = new HttpParams()
    .set('page', pagingOption.page)
    .set('size', pagingOption.size)
    .set('sort', pagingOption.keySearch ? pagingOption.keySearch : '');
    return this.http.get<any>(`${CoreUrl.API_PATH}/${CoreUrl.PRODUCT}/${id}/related-products`, {params: params});
  }
  
  assignProduct(productId: string, listProductIds: string[]) {
    return this.http.post(`/api/v1/product/${productId}/$assign-related`, { ids: listProductIds });
  }

  getProductById(item: any) {
    return this.http.get<IProduct>(
      `/api/v1/product/${item.id}`
    );
  }
  createProduct(formData: any) {
    return this.http.post(`/api/v1/product`, formData);
  }
  uploadImage(files: File[]) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    return this.http.post<IImageInfo[]>(`/api/v1/image/upload`, formData);
  }

  updateImages(idImage : string, files: File[]) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    return this.http.put<IImageInfo[]>(`/api/v1/image/${idImage}/update`, formData);
  }

  updateProduct(formData: any) {
    return this.http.put(`/api/v1/product/${formData.id}`, formData);
  }
  deleteProduct(ids: any[]) {
    return this.http.delete(`/api/v1/product`, { body: { ids } });
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/product/$change-status`, payload);
  }



}
