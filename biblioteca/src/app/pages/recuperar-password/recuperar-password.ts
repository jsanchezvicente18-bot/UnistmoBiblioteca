import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  buscarUsuario() {

    if (!this.correo.trim()) {
      this.mensaje = 'Ingresa tu correo electrónico';
      return;
    }

    this.http.post<any>(
      'http://localhost:8000/recuperar-password',
      {
        correo: this.correo.trim()
      }
    ).subscribe({

      next: (res) => {

        console.log('Respuesta buscar usuario:', res);

        this.mensaje = res.mensaje || '';

        this.usuarioEncontrado = (res.ok === true || res.success === true);

      },

      error: (err) => {

        console.error(err);

        this.usuarioEncontrado = false;
        this.mensaje = 'No se pudo conectar con el servidor';

      }

    });

  }

  cambiarPassword() {

    if (!this.nuevaPassword.trim() || !this.confirmarPassword.trim()) {
      this.mensaje = 'Completa ambos campos de contraseña';
      return;
    }

    const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

if (!passwordRegex.test(this.nuevaPassword)) {
  this.mensaje =
    'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.';
  return;
}

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.http.put<any>(
      'http://localhost:8000/cambiar-password',
      {
        correo: this.correo.trim(),
        nueva_password: this.nuevaPassword.trim()
      }
    ).subscribe({

      next: (res) => {

        console.log('Respuesta cambiar contraseña:', res);

        if (res.ok === true || res.success === true) {

          alert('Contraseña cambiada correctamente.');

          this.nuevaPassword = '';
          this.confirmarPassword = '';
          this.usuarioEncontrado = false;
          this.correo = '';
          this.mensaje = '';

          this.router.navigateByUrl('/login');

        } else {

          this.mensaje = res.mensaje || 'No se pudo cambiar la contraseña';

        }

      },

      error: (err) => {

        console.error(err);

        this.mensaje = 'No se pudo conectar con el servidor';

      }

    });

  }

}