import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  produitSelectionne: any = null;

  constructor(private productService: ProductService) { }


  selectionnerProduit(produit: any) {
    this.produitSelectionne = produit;
  }


  ngOnInit() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }
}



// import { Component, OnInit } from "@angular/core";
// //import { ImageService } from '../services/image.service'; // Assurez-vous que le chemin est correct

// @Component({
//     selector: 'app-home',
//     templateUrl: './home.component.html',
//     styleUrls: ['./home.component.scss']
// })

// export class HomeComponent implements OnInit{

//   ngOnInit() {

//   }
    
// }