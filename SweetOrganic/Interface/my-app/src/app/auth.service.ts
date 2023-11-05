import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private cookieService: CookieService) {}

  // Vérifiez si le token d'authentification existe dans les cookies
  isLoggedIn(): boolean {
    const tokenExists = this.cookieService.check('authToken');
    return tokenExists;
  }
}
