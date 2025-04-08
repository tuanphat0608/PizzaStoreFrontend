import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/post.model';
import {IProduct} from "../../../model/model";

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) { }

  getNews(options: any) {
    return this.http.get(
      `/api/v1/news`,
      {
        params: {
          page: options.page,
          size: options.size,
          is_system: options.is_system || false
        }
      }
    );
  }
  getNewsById(item: any) {
    return this.http.get(
      `/api/v1/news/${item.id}`
    );
  }

  createNews(formData: any) {
    return this.http.post(`/api/v1/news`, formData);
  }

  updateNews(formData: any) {
    return this.http.put(`/api/v1/news/${formData.id}`, formData);
  }

  deleteNews(ids: string[]) {
    return this.http.delete(`/api/v1/news`, { body: { ids } });
  }

  uploadImage(file: any) {
    let formData = new FormData();
    formData.append('files', file);
    return this.http.post(`/api/v1/image/upload`, formData);
  }

  hidePost(ids: string[]) {
    return this.http.put(`/api/v1/news/$disable`, { ids });
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/news/$change-status`, payload);
  }

}
