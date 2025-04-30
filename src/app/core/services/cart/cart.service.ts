import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient: HttpClient) { }
  myToken = localStorage.getItem('userToken')

  cartNumber: BehaviorSubject<number> = new BehaviorSubject(0)

  addToCartProduct(id: string): Observable<any> {
    return this.httpClient.post('https://ecommerce.routemisr.com/api/v1/cart',
      {
        "productId": id
      },
    )
  }

  updateCartProductQuantity(id: string, count: number): Observable<any> {
    return this.httpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      {
        "count": count
      },)
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get('https://ecommerce.routemisr.com/api/v1/cart')
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`)
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete('https://ecommerce.routemisr.com/api/v1/cart')
  }

}
