import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }


  getCategories(): Observable<any> {
    return this.httpClient.get(`${environment.basUrl}/api/v1/categories`)
  }

  getSpecificCategories(id: string): Observable<any> {
    return this.httpClient.get(`${environment.basUrl}/api/v1/categories/${id}`)
  }

  getAllSubCategories(id: string | null): Observable<any> {
    return this.httpClient.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`)
  }
}
