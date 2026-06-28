import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  matricula = '';
  password = '';
  mostrarPassword = false;

  mostrarModalContacto = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  abrirModalContacto() {
    this.mostrarModalContacto = true;
  }

  cerrarModalContacto() {
    this.mostrarModalContacto = false;
  }

  ingresar() {

    if (!this.matricula.trim() || !this.password.trim()) {
      alert('Ingresa matrícula/correo y contraseña');
      return;
    }

    this.http.post<any>(
      'http://localhost:8000/login',
      {
        matricula: this.matricula.trim(),
        password: this.password.trim()
      }
    ).subscribe({
      next: (respuesta) => {

        if (respuesta.success !== true) {
          alert(respuesta.mensaje || 'Matrícula o contraseña incorrectas');
          return;
        }

        localStorage.setItem('usuarioId', respuesta.id || '');
        localStorage.setItem('nombreUsuario', respuesta.nombre || '');
        localStorage.setItem('tipoUsuario', respuesta.tipo || '');
        localStorage.setItem('correoUsuario', respuesta.correo || '');
        localStorage.setItem('matriculaUsuario', respuesta.matricula || '');
        localStorage.setItem('carreraUsuario', respuesta.carrera || '');
        localStorage.setItem('fechaRegistro', respuesta.fechaRegistro || '');
        localStorage.setItem('fotoPerfil', respuesta.fotoPerfil || '/img/user.png');

        this.router.navigate(['/inicio']);
      },

      error: (error) => {
        console.error(error);
        alert('Error al iniciar sesión. Revisa que el backend esté encendido.');
      }
    });

  }

}