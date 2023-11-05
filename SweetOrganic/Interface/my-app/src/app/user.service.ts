import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user/customer';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.cookieService.get('authToken')}`
    });


    return this.http.get(`${this.apiUrl}/me`, { headers: headers });
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logoutUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.cookieService.get('authToken')}`
    });

    // Pas de corps de requête nécessaire, donc on passe un objet vide.
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: headers, responseType: 'text'});
  }

  logoutAllUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.cookieService.get('authToken')}`
    });
    // Pas de corps de requête nécessaire, donc on passe un objet vide.
    return this.http.post(`${this.apiUrl}/logout/all`, {}, { headers: headers, responseType: 'text' });
  }
}
