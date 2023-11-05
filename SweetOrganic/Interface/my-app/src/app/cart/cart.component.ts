import { Component } from "@angular/core";
import { CartService } from "../services/cart.service";
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { query } from "@angular/animations";
@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})

export class CartComponent{
    cartData: any;

    constructor(private fb: FormBuilder, private http: HttpClient, private cartService: CartService){

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
    updateQuantity(quantity: Number){
        console.log(quantity);
    }
    submitForm() {
        // Cette méthode est appelée lorsqu'un changement est détecté dans le menu déroulant
        // Vous pouvez ici soumettre la requête POST vers votre endpoint
        // Exemple : this.http.post('votre-url', { id: article.id, quantity: article.quantity }).subscribe();
      }
}