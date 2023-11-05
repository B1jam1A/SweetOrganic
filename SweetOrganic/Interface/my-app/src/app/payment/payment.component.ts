import { Component } from "@angular/core";
import { CartService } from "../services/cart.service";
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { query } from "@angular/animations";
@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentComponent{


    constructor(){

    }

    ngOnInit(): void {

    }
}