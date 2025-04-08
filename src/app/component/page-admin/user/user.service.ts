import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusPostModel } from '../common/models/post.model';
import {IGenericProduct} from "../../../model/model";
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser(options: any) {
    return this.http.get<any>(
      `/api/v1/auth/user`,
      {
        params: {
          page: options.page,
          size: options.size,
          sort: ''
        }
      }
    );
  }

  registerUser(formData: any) {
    const dataUserRegister = {
      'username': formData.username,
      'role': formData.role,
      "is_require_reset_pw_at_first_time_login": formData.is_require_reset_pw_at_first_time_login
    };
  
    return this.http.post(`/api/v1/auth/create-user`, dataUserRegister)
      .pipe(
        catchError(error => {
          throw error; // Rethrow the error for the component to handle
        })
      );
  }


  updateUser(User: any) {
    return this.http.put(`/api/v1/auth/${User.username}`, User);
  }

  resetPassword(username: string) {
    const user = {
      'username' : username,
      'password' : '123456aA@'
    }
    return this.http.post(`/api/v1/auth/$reset-password`, user);
  }

}
