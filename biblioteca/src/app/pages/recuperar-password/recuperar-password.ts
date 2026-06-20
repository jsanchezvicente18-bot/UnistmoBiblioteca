import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.scss'
})
export class RecuperarPassword {

  correo = '';
  nuevaPassword = '';
  confirmarPassword = '';

  usuarioEncontrado = false;
  mensaje = '';

  constructor(private http: HttpClient) {}

  buscarUsuario() {
    console.log('Correo enviado:', this.correo);

  this.http.post<any>('http://localhost:8000/recuperar-password', {
    correo: this.correo
  }).subscribe({
    next: (res) => {
      console.log('Respuesta backend:', res);

      this.mensaje = res.mensaje;
      this.usuarioEncontrado = res.ok;
    },
    error: (err) => {
      console.log('Error backend:', err);
      this.mensaje = 'No se pudo conectar con el servidor';
    }
    });
  }

  cambiarPassword() {

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.http.put<any>('http://localhost:8000/cambiar-password', {
      correo: this.correo,
      nueva_password: this.nuevaPassword
    }).subscribe(res => {
      this.mensaje = res.mensaje;

      if (res.ok) {
        this.nuevaPassword = '';
        this.confirmarPassword = '';
      }
    });
  }
}