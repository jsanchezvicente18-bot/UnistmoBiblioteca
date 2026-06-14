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

  nombreUsuario =
    localStorage.getItem('nombreUsuario') || '';
  
  fotoPerfil =
    localStorage.getItem('fotoPerfil') || '/img/user.png';

  correoUsuario = '';

  matriculaUsuario = '';

  carreraUsuario = '';

  fechaRegistro = '';

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
  seleccionarFoto(event: any) {

  const archivo = event.target.files[0];

  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.fotoPerfil =
      reader.result as string;

    localStorage.setItem(
      'fotoPerfil',
      this.fotoPerfil
    );

  };

  reader.readAsDataURL(archivo);

}

}