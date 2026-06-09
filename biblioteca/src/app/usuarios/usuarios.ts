import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios {

  tipoUsuario = localStorage.getItem('tipoUsuario');

  mostrarFormulario = false;

  nuevoUsuario = {
    nombre: '',
    correo: '',
    tipo: 'estudiante'
  };

  usuarios = [
    {
      nombre: 'Jaki',
      correo: 'jaki@unistmo.com',
      tipo: 'admin'
    },
    {
      nombre: 'Carlos Pérez',
      correo: 'carlos@unistmo.com',
      tipo: 'profesor'
    }
  ];

  guardarUsuario() {

    this.usuarios.push({
      ...this.nuevoUsuario
    });

    this.nuevoUsuario = {
      nombre: '',
      correo: '',
      tipo: 'estudiante'
    };

    this.mostrarFormulario = false;
  }

  eliminarUsuario(usuario: any) {

    this.usuarios = this.usuarios.filter(
      u => u !== usuario
    );
  }

  editarUsuario(usuario: any) {
    alert('Editar usuario: ' + usuario.nombre);
  }

}