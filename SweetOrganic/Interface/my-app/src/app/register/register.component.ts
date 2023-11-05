// ... autres importations ...
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';

interface Adresse {
  numero: string;
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', Validators.required],
      // ... autres contrôles ...
      adresses: this.fb.array([this.createAddressGroup()])
    });
  }

  ngOnInit(): void {
  }

  get adresses(): FormArray {
    return this.registerForm.get('adresses') as FormArray;
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      numero: ['', Validators.required],
      rue: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      pays: ['', Validators.required],
    });
  }

  addAddress(): void {
    this.adresses.push(this.createAddressGroup());
  }
  onRegisterSubmit() {
    if (this.registerForm.valid) {
      // Formatage des données pour correspondre à la structure attendue par le backend
      const formattedData = {
        ...this.registerForm.value,
        adresses: this.registerForm.value.adresses.map((a: Adresse) => ({ adresse: a }))
      };
  
      this.userService.registerUser(formattedData).subscribe(
        // ...
      );
    }
  }
  // ... autres méthodes ...
}
