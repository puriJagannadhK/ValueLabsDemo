import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) {}
    BaseUrl="http://localhost:7275/api/Customer/";
    loginUrl='login'; 

    login(credentials: { username: string; password: string }): Observable<any> {
        const apiUrl = this.BaseUrl+this.loginUrl;
        return this.http.post<any>(apiUrl, credentials, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('authToken')}` 
          })
        });
      }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        this.router.navigate(['/']);
    }
    updateCustomer(customer: any) {
      return this.http.put(this.BaseUrl+customer.userId, customer);
    }

    createCustomer(customer: any) {
      return this.http.post(this.BaseUrl, customer);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }
}
