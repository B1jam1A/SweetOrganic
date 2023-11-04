import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = 'http://localhost:3001/Cart'; // Remplacez par l'URL de votre microservice Panier

  constructor(private http: HttpClient) { }

  getCartData() {
    return this.http.get(this.cartUrl);
  }
}
