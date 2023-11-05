import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class PaymentHttpInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Vérifiez si la requête est une requête POST vers "http://localhost:4200/payment"
    if (request.method === 'POST' && request.url === 'http://localhost:4200/payment') {
      // Effectuez vos actions de manipulation ici
      // Par exemple, ajoutez des en-têtes à la requête ou effectuez des actions personnalisées

      // Exemple : Ajoutez un en-tête d'autorisation
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('authToken')}`,
        },
      });

      // Poursuivez la chaîne d'interception avec la requête modifiée
      return next.handle(modifiedRequest);
    }

    // Si ce n'est pas une requête POST vers "http://localhost:4200/payment", poursuivez normalement
    return next.handle(request);
  }
}
