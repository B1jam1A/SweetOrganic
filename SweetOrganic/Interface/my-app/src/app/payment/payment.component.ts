import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentComponent{


    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router){

    }

    ngOnInit(): void {

    }

    process_payment() {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.cookieService.get('authToken')}`
        });
      
        this.http.post('http://localhost:3002/create-checkout-session', null, { headers }).subscribe(
          (response: any) => { // Assurez-vous de spécifier le type de la réponse si vous connaissez sa structure
            // Redirige vers le paiement
            console.log('Redirection vers le paiement...', response);
            if (response.url) {
              // Assurez-vous que la réponse contient bien l'URL
              window.location.href = response.url; // Redirection de la page vers l'URL de paiement
            } else {
              console.error("L'URL de paiement est manquante dans la réponse.");
            }
          },
          error => {
            console.error("Erreur lors de la redirection vers le paiement", error);
          }
        );
        console.log("Création d'une session de paiement...");
    }
}