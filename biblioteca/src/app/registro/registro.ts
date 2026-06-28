import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {

  nuevoUsuario = {
    nombre: '',
    matricula: '',
    correo: '',
    telefono: '',
    password: '',
    tipo: 'estudiante'
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  registrar() {

    // Validar teléfono
    if (!/^[0-9]{10}$/.test(this.nuevoUsuario.telefono)) {
      alert('El teléfono debe tener exactamente 10 dígitos');
      return;
    }

    // Validar matrícula
    if (!/^[0-9]+$/.test(this.nuevoUsuario.matricula)) {
      alert('La matrícula solo debe contener números');
      return;
    }

    // Validar contraseña
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    if (!passwordRegex.test(this.nuevoUsuario.password)) {
      alert(
        'La contraseña debe tener mínimo 8 caracteres, una letra mayúscula, un número y un símbolo.'
      );
      return;
    }

    this.http.post(
      'http://localhost:8000/usuarios',
      this.nuevoUsuario
    ).subscribe({
      next: () => {

        alert('Usuario registrado correctamente');

        this.router.navigate(['/login']);

      },
      error: (error) => {

        console.error(error);

        alert('Error al registrar usuario');

      }
    });

  }

}