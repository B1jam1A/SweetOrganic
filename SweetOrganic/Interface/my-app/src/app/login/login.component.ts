import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private cookieService: CookieService,   
    private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/api/user/customer/login', this.loginForm.value).subscribe(
        (response: any) => {
          this.cookieService.set('authToken', response.authToken);
          // Redirection vers /home
          this.router.navigate(['/home']);
        },
        (error) => {
          // Gestion des erreurs
          console.error('Login error:', error);
        }
      );
    }
  }
}
