import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  constructor(private router: Router) {}

  ingresar() {
    this.router.navigate(['/inicio']);
  }

}