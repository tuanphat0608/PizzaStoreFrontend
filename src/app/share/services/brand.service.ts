import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {IBrand} from "../../model/model";

@Injectable({ providedIn: 'root' })
export class BrandService {
  constructor(private http: HttpClient) { }

  getAllBrand() {
    return this.http.get<IBrand[]>(
      `/api/v1/brand?page=0&size=1000`
    );
  }
  createBrand(brand: IBrand) {
    return this.http.post<IBrand>(
      `/api/v1/brand`, brand
    );
  }


  updateBrand(brand: IBrand) {
    return this.http.put(`/api/v1/brand/${brand.id}`, brand);
  }

  deleteBrand(ids: string[]) {
    return this.http.delete(`/api/v1/brand`, { body: { ids } });
  }

}
