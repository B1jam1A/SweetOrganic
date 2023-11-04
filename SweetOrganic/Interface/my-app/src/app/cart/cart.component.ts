import { Component } from "@angular/core";
import { CartService } from "../services/cart.service";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})

export class CartComponent{
    /*cartData: any;

    constructor(private cartService: CartService){
        this.getCartData();
        console.log("Panier reçu !");
        console.log(this.cartData);
    }

    getCartData(){
        this.cartService.getCartData().subscribe((data) => {
            this.cartData = data;
        });
    }*/
}