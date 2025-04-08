import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) { }

  getReview(options: any) {
    return this.http.get(
      `/api/v1/review`,
      {
        params: {
          page: options.page,
          size: options.size,
          isActive: options.is_active
        }
      }
    );
  }

  createReview(formData: any) {
    return this.http.post(`/api/v1/review`, formData);
  }
  ReviewBulk(formData: any) {
    return this.http.post(`/api/v1/review/bulk`, formData);
  }
  updateReview(formData: any) {
    return this.http.put(`/api/v1/review/${formData.id}`, formData);
  }

  deleteReview(ids: string[]) {
    return this.http.delete(`/api/v1/review`, { body: { ids } });
  }

  uploadImage(file: any) {
    let formData = new FormData();
    formData.append('files', file);
    return this.http.post(`/api/v1/image/upload`, formData);
  }

  hideReview(ids: string[]) {
    return this.http.put(`/api/v1/review/$disable`, { ids });
  }

  changeStatus(payload: ChangeStatusPostModel) {
    return this.http.put(`/api/v1/review/$change-status`, payload);
  }

}
