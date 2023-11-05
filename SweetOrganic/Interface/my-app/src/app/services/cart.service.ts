import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = 'http://localhost:3001/Cart'; // Remplacez par l'URL de votre microservice Panier

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getCartData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.cookieService.get('authToken')}`
    });
    return this.http.get(this.cartUrl, {headers: headers});
  }
}
