import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../../component/page-admin/common/models/post.model';
import {IGenericProduct, ISetting} from "../../model/model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) { }

  uploadImage(file: any) {
    let formData = new FormData();
    formData.append('files', file);
    return this.http.post(`/api/v1/image/upload`, formData);
  }

  updateSetting(formData: any) {
    return this.http.post(`/api/v1/setting`, formData);
  }
  getSetting() {
    return this.http.get<ISetting>(`/api/v1/setting`);
  }
}
