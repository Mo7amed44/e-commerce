import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProduct(): Observable<any> {
    return this.httpClient.get(`${environment.basUrl}/api/v1/products`)
  }
  getSpecificProducts(id: string | null): Observable<any> {
    return this.httpClient.get(`${environment.basUrl}/api/v1/products/${id}`)
  }

}
