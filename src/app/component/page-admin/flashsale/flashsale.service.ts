import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel, ChangeStatusPostModel } from '../common/models/category.model';
import { BaseSearchModel } from '../common/models/base.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FlashsaleService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${environment.apiKeyType} ${environment.apiKey}`
  });
  constructor(private http: HttpClient) { }

  getFlashale(options: any) {
    return this.http.get(
      `/api/v1/flash-sale`, {
      params: {
        page: options.page,
        size: options.size,
        status: "",
        
      }
    }
    );
  }

  getFlashSaleDetail(flashSaleId: string) {
    return this.http.get(
      `/api/v1/flash-sale/${flashSaleId}`
    );
  }

  addNewFlashSale(formData: any) {
   
    return this.http.post(`/api/v1/flash-sale`, formData,{ headers: this.headers });
  }

  updateNewFlashSale(formData: any) {
    return this.http.put(`/api/v1/flash-sale/${formData.id}`, formData,{ headers: this.headers });
  }

  deleteFlashSale(item: any) {
    return this.http.delete(`/api/v1/flash-sale/${item.id}`);
  }

  deleteMultipleFlashSale(ids: string[]) {
    return this.http.delete(`/api/v1/flash-sale`, { body: { ids }});
  }

  changeFlashSaleStatus(ids: string[]) {
  }

  assignProduct(flashSaleId: string, listProductIds: string[]) {
    return this.http.post(`/api/v1/flash-sale/${flashSaleId}/$assign`, { ids: listProductIds });
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/flash-sale/$change-status`, payload,{ headers: this.headers });
  }

  getProuductByFlashSaleId(options: any, flashSaleId: string) {
    return this.http.get(`/api/v1/flash-sale/${flashSaleId}/product`, {
      params: {
        page: options.page,
        size: options.size,
      }
    });
  }

  searchProductToAssign(pageOption: BaseSearchModel, flashSaleId: number | string) {
    return this.http.get(`/api/v1/flash-sale/${flashSaleId}/all-product`, {
      params: {
        page: pageOption.page,
        size: pageOption.size,
        name: pageOption.keySearch || ""
      }
    });
  }

}
