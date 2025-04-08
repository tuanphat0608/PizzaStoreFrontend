import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel, ChangeStatusPostModel } from '../common/models/category.model';
import { BaseSearchModel } from '../common/models/base.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategory(options: any) {
    return this.http.get(
      `/api/v1/category`, {
      params: {
        page: options.page,
        size: options.size,
      }
    }
    );
  }

  getCategoryDetail(categoryId: string) {
    return this.http.get(
      `/api/v1/category/${categoryId}`
    );
  }

  addNewCategory(formData: CategoryModel) {
    return this.http.post(`/api/v1/category`, formData);
  }

  updateNewCategory(formData: CategoryModel) {
    if(!formData.content)  formData.content = "";
    return this.http.put(`/api/v1/category/${formData.id}`, formData);
  }

  updateStatusCategory(formData: CategoryModel) {
    const formattedData = {
      bulkEdits: [
        {
          id: formData.id,
          isActive: formData.is_active,
          isShowInDashboard: formData.is_show_in_dashboard,
          isPopular: formData.is_popular,
          isAdvertise: formData.is_advertise,
          status: ''
        }
      ]
    };
    return this.http.put<String>(`/api/v1/category/$change-status`, formattedData);

  }

  deleteCategory(item: CategoryModel) {
    return this.http.delete(`/api/v1/category/${item.id}`);
  }

  deleteMultipleCategory(ids: string[]) {
    return this.http.delete(`/api/v1/category`, { body: { ids } });
  }

  changeCategoryStatus(ids: string[]) {
  }

  assignProduct(categoryId: string, listProductIds: string[]) {
    return this.http.post(`/api/v1/category/${categoryId}/$assign`, { ids: listProductIds });
  }

  uploadImage(file: any) {
    let formData = new FormData();
    formData.append('files', file);
    return this.http.post(`/api/v1/image/upload`, formData);
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/category/$change-status`, payload);
  }

  getProuductByCategoryId(options: any, categoryId: string) {
    return this.http.get(`/api/v1/category/${categoryId}/product`, {
      params: {
        page: options.page,
        size: options.size,
      }
    });
  }

  searchProductToAssign(pageOption: BaseSearchModel, categoryId: number | string) {
    return this.http.get(`/api/v1/category/${categoryId}/all-product`, {
      params: {
        page: pageOption.page,
        size: pageOption.size,
        name: pageOption.keySearch || ""
      }
    });
  }

}
