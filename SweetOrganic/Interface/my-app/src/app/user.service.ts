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

    // Utilisez http.get() au lieu de http.post()
    return this.http.get(`${this.apiUrl}/me`, { headers: headers });
  }
}
