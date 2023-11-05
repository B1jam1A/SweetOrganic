import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  userProfile: any;

  constructor(private userService: UserService) {}

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
