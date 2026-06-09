import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.scss'
})
export class Prestamos implements OnInit {

  tipoUsuario = localStorage.getItem('tipoUsuario');

  prestamos: any[] = [];

  usuarios: any[] = [];

  libros: any[] = [];

  mostrarFormulario = false;

  nuevoPrestamo = {
    usuario_id: '',
    libro_id: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {

    this.cargarPrestamos();

    this.cargarUsuarios();

    this.cargarLibros();

  }

cargarPrestamos() {

  this.http.get<any[]>(
    'http://localhost:8000/prestamos-detalle'
  ).subscribe({

    next: (data) => {

      console.log('Préstamos:', data);

      this.prestamos = data;

    },

    error: (error) => {

      console.error(
        'Error al cargar préstamos',
        error
      );

    }

  });

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

  cargarLibros() {

    this.http.get<any[]>(
      'http://localhost:8000/libros'
    ).subscribe({

      next: (data) => {

        console.log('Libros:', data);

        this.libros = data;

      },

      error: (error) => {

        console.error(
          'Error al cargar libros',
          error
        );

      }

    });

  }

  guardarPrestamo() {

  this.http.post(
    'http://localhost:8000/prestamos',
    this.nuevoPrestamo
  ).subscribe({

    next: () => {

      alert('Préstamo creado correctamente');

      this.cargarPrestamos();

      this.nuevoPrestamo = {
        usuario_id: '',
        libro_id: ''
      };

      this.mostrarFormulario = false;

    },

    error: (error) => {

      console.error(error);

      alert('Error al crear préstamo');

    }

  });

}
}