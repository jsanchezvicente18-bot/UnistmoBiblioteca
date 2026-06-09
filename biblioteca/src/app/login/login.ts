import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {

  tipoUsuario = 'estudiante';

  constructor(private router: Router) {}

  ingresar() {

    localStorage.setItem(
      'tipoUsuario',
      this.tipoUsuario
    );

    this.router.navigate(['/inicio']);

  }

}