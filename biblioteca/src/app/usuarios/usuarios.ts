import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {

  tipoUsuario = localStorage.getItem('tipoUsuario');

  mostrarFormulario = false;

  usuarios: any[] = [];

  nuevoUsuario = {
    nombre: '',
    matricula: '',
    carrera: '',
    correo: '',
    telefono: '',
    password: '',
    tipo: 'estudiante'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {

    this.http.get<any[]>(
      'http://localhost:8000/usuarios'
    ).subscribe({

      next: (data) => {

        console.log('Usuarios:', data);

        this.usuarios = data;

      },

      error: (error) => {

        console.error(
          'Error al cargar usuarios',
          error
        );

      }

    });

  }

  guardarUsuario() {

    this.http.post(
      'http://localhost:8000/usuarios',
      this.nuevoUsuario
    ).subscribe({

      next: () => {

        this.cargarUsuarios();

        this.nuevoUsuario = {
          nombre: '',
          matricula: '',
          carrera: '',
          correo: '',
          telefono: '',
          password: '',
          tipo: 'estudiante'
        };

        this.mostrarFormulario = false;

      },

      error: (error) => {

        console.error(
          'Error al guardar usuario',
          error
        );

      }

    });

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