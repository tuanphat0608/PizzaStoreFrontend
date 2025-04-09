import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { API, CORE_URL } from '../constant/api.constants';
import { CoreUrl } from '../constant/url.constant';

@Injectable({
  providedIn: 'root'
})
export class PermisisonService {
  permission$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) { }

  getPermission(): string[] {
    return this.permission$.value;
  }

  setPermission(permission: string[]) {
    this.permission$.next(permission);
  }

  hasPermission(permission: string): boolean {
    return this.getPermission().includes(permission) || false;
  }

  refreshUserPermission(userId: string) {
    return this.http.get(`${CORE_URL}/${API.USER_PERMIISON}`, { params: { userId } })
  }

  checkToken(token: string): Observable<boolean> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.get<boolean>(`${CoreUrl.API_PATH}/auth/$validate-token`, {params: params});
  }
}
