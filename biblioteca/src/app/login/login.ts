import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  matricula = '';
  password = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ingresar() {

    this.http.post<any>(
      'http://localhost:8000/login',
      {
        matricula: this.matricula,
        password: this.password
      }
    ).subscribe({

      next: (respuesta) => {

        if (!respuesta.success) {

          alert(respuesta.mensaje);
          return;

        }

        localStorage.setItem(
          'usuarioId',
          respuesta.id
        );

        localStorage.setItem(
          'nombreUsuario',
          respuesta.nombre
        );

        localStorage.setItem(
          'tipoUsuario',
          respuesta.tipo
        );

        this.router.navigate(['/inicio']);

      },

      error: (error) => {

        console.error(error);

        alert('Error al iniciar sesión');

      }

    });

  }

}