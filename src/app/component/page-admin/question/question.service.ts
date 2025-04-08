import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/post.model';
import {IGenericProduct} from "../../../model/model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) { }

  getQuestion(options: any) {
    return this.http.get<IGenericProduct>(
      `/api/v1/question`,
      {
        params: {
          page: options.page,
          size: options.size,
          isActive: options.is_active || false
        }
      }
    );
  }

  createQuestion(formData: any) {
    return this.http.post(`/api/v1/question`, formData);
  }

  questionBulk(formData: any) {
    return this.http.post(`/api/v1/question/bulk`, formData);
  }
  updateQuestion(questionProduct: any) {
    return this.http.put(`/api/v1/question/${questionProduct.id}`, questionProduct);
  }

  deleteQuestion(ids: string[]) {
    return this.http.delete(`/api/v1/question`, { body: { ids } });
  }

  uploadImage(file: any) {
    let formData = new FormData();
    formData.append('files', file);
    return this.http.post(`/api/v1/image/upload`, formData);
  }

  hideQuestion(ids: string[]) {
    return this.http.put(`/api/v1/question/$disable`, { ids });
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/question/$change-status`, payload);
  }

}
