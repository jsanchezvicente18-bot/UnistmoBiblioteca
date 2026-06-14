import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  usuarioLogueado = '';
  nombreUsuario = '';

  tipoUsuario =
    localStorage.getItem('tipoUsuario');

  prestamos: any[] = [];

  usuarios: any[] = [];

  libros: any[] = [];

  mostrarFormulario = false;

  prestamosActivos = 0;
  prestamosVencidos = 0;

  usuarioTop = 'Sin datos';
  libroTop = 'Sin datos';

  nuevoPrestamo = {
    usuario_id: '',
    libro_id: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.usuarioLogueado =
      localStorage.getItem('usuarioId') || '';

    this.nombreUsuario =
      localStorage.getItem('nombreUsuario') || '';

    this.cargarPrestamos();

    if (this.tipoUsuario === 'admin') {
      this.cargarUsuarios();
    }

    this.cargarLibros();
  }

  cargarPrestamos() {

    if (this.tipoUsuario === 'admin') {

      this.http.get<any[]>(
        'http://localhost:8000/prestamos-detalle'
      ).subscribe({

        next: (data) => {

          console.log('Préstamos:', data);

          this.prestamos = [...data];

          this.calcularEstadisticas();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar préstamos',
            error
          );

        }

      });

    } else {

      this.http.get<any[]>(
        `http://localhost:8000/prestamos-usuario/${this.usuarioLogueado}`
      ).subscribe({

        next: (data) => {

          console.log('Mis préstamos:', data);

          this.prestamos = [...data];

          this.calcularEstadisticas();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar préstamos',
            error
          );

        }

      });

    }

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

    this.nuevoPrestamo.usuario_id =
      this.usuarioLogueado;

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

  calcularEstadisticas() {

    this.prestamosActivos = this.prestamos.filter(
      p => p.estado === 'Activo'
    ).length;

    this.prestamosVencidos = this.prestamos.filter(
      p => p.estado === 'Vencido'
    ).length;

  }

  renovarPrestamo(prestamo: any) {

    alert(
      'Renovar préstamo de: ' +
      prestamo.libro
    );

  }

  verDetalle(prestamo: any) {

    alert(
      'Libro: ' +
      prestamo.libro +
      '\nUsuario: ' +
      prestamo.usuario
    );

  }

}