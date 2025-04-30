import { JwtDecodeOptions } from './../../../../../node_modules/jwt-decode/build/cjs/index.d';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  private readonly router = inject(Router)
  userData: any = null

  signUpData(data: string): Observable<any> {
    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/signup`, data)
  }


  signInData(data: string): Observable<any> {
    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/signin`, data)
  }

  getToken(): void {
    if (localStorage.getItem('userToken') !== null) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!)
    }
  }


  signout(): void {
    localStorage.removeItem('userToken')
    this.userData = null
    this.router.navigate(['/login'])
  }

  forgetPassword(data: object): Observable<any> {
    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/forgotPasswords`, data)
  }
  VerifyResetCode(data: any): Observable<any> {
    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/verifyResetCode`, data);
  }
  ResetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.basUrl}/api/v1/auth/resetPassword`, data)
  }


}



