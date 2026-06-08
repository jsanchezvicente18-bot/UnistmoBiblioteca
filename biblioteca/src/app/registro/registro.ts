import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {

  telefono = '';
  correo = '';

  constructor(private router: Router) {}

  registrar() {

    if (this.telefono.length !== 10) {

      alert('El teléfono debe tener 10 dígitos');
      return;

    }

    alert('Usuario registrado correctamente');

    this.router.navigate(['/login']);

  }

}