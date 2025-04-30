import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpClient: HttpClient) { }

  wishlistNumber: BehaviorSubject<number> = new BehaviorSubject(0)

  myToken = localStorage.getItem('userToken')
  getProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
      {
        "productId": id
      }
    )
  }

  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`)
  }
  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get('https://ecommerce.routemisr.com/api/v1/wishlist',
      {
        headers: {
          token: this.myToken!
        }
      }
    )
  }

}
