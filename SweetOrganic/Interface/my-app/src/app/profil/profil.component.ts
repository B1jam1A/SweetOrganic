import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  userProfile: any;

  constructor(private userService: UserService,
    private cookieService: CookieService,
    private router: Router) {}


  logout() {
    this.userService.logoutUser().subscribe(response => {
      this.cookieService.delete('authToken');
      this.router.navigate(['/home']);
    }, error => {
      console.error('Erreur lors de la déconnexion', error);
    });
  }

  logoutAll() {
    this.userService.logoutAllUser().subscribe(response => {
      this.cookieService.delete('authToken');
      this.router.navigate(['/home']);
    }, error => {
      console.error('Erreur lors de la déconnexion de tous les appareils', error);
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      data => {
        this.userProfile = data;
      },
      error => {
        console.log(error);
      }
    );
  }
}
