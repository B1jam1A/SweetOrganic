import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {CartComponent} from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';


import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profil', component: ProfilComponent },


  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
