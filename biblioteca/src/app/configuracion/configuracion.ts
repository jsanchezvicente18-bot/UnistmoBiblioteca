import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss'
})
export class Configuracion {

  tipoUsuario = localStorage.getItem('tipoUsuario');

  passwordActual = '';

  nuevaPassword = '';

  cambiarPassword() {

    if (!this.passwordActual || !this.nuevaPassword) {

      alert('Completa todos los campos');
      return;

    }

    alert('Función de cambio de contraseña en desarrollo');

    this.passwordActual = '';
    this.nuevaPassword = '';

  }

}
