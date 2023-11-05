import { Component } from "@angular/core";
import { CartService } from "../services/cart.service";
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { query } from "@angular/animations";
import { CookieService } from "ngx-cookie-service";
@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})

export class CartComponent{
    cartData: any = '';

    constructor(private fb: FormBuilder, private http: HttpClient, private cartService: CartService, private cookieService: CookieService){

    }

    /*getCartData(){
        this.cartService.getCartData().subscribe((data) => {
            this.cartData = data;
        });
    }*/

    ngOnInit(): void {
        this.cartService.getCartData().subscribe(
            cart => {
                this.cartData = cart;
                console.log(this.cartData);
            },
            error =>{
                console.log(error);
            }
        );
    }
    updateQuantity(quantity: number){
        console.log(quantity);
    }
    submitForm() {
        // Cette méthode est appelée lorsqu'un changement est détecté dans le menu déroulant
        // Vous pouvez ici soumettre la requête POST vers votre endpoint
        // Exemple : this.http.post('votre-url', { id: article.id, quantity: article.quantity }).subscribe();
    }

    supprimerArticleDuPanier(idArticle: string): void {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.cookieService.get('authToken')}`
        });
    
        const url = `http://localhost:3001/Cart/allCarts/${this.cartData.idPanier}/articles/${idArticle}`;
    
        this.http.delete(url, { headers }).subscribe(
          response => {
            // Gérer la réponse de la suppression de l'article
            console.log('Article supprimé avec succès', response);
            this.loadCartData();
          },
          error => {
            console.error('Erreur lors de la suppression de l\'article', error);
          }
        );
    }

    loadCartData(): void {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.cookieService.get('authToken')}`
        });
      
        // Faites une requête HTTP GET pour récupérer les données du panier
        this.http.get('http://localhost:3001/Cart', { headers }).subscribe(
          (response: any) => {
            // Mettez à jour les données du panier dans votre composant
            this.cartData = response;
          },
          error => {
            console.error('Erreur lors du chargement des données du panier', error);
          }
        );
    }

    redirect_payment(): void {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.cookieService.get('authToken')}`
        });

        this.http.get('http://localhost:3001/redirect-payment', { headers }).subscribe(
          response => {
            // Redirige vers le payment
            console.log('redirection vers le paiement...', response);
          },
          error => {
            console.error('Erreur lors de la suppression de l\'article', error);
          }
        );
    }
    
    
    
}