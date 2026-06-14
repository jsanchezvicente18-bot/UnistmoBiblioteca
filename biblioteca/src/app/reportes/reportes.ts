import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})

export class Reportes implements OnInit {

  tipoUsuario =
    localStorage.getItem('tipoUsuario') || '';

  /* ADMIN */

  totalLibros = 0;
  usuariosRegistrados = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;
  prestamosVencidos = 0;

  librosMasPrestados: string[] = [];
  usuariosActivos: string[] = [];
  actividadReciente: string[] = [];

  /* USUARIO */

  librosDevueltos = 0;
  favoritos = 0;

  totalPrestamos = 0;

  libroFavorito = 'Sin datos';
  ultimoPrestamo = 'Sin datos';

  historialLibros: string[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.cargarEstadisticas();

    if (this.tipoUsuario !== 'admin') {

      this.cargarDatosUsuario();

    }

  }

  cargarEstadisticas() {

    this.http.get<any>(
      'http://localhost:8000/estadisticas'
    ).subscribe({

      next: (data) => {

        this.totalLibros =
          data.libros || 0;

        this.usuariosRegistrados =
          data.usuarios || 0;

        this.prestamosActivos =
          data.prestamos || 0;

        this.librosDisponibles =
          data.disponibles || 0;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error al cargar estadísticas',
          error
        );

      }

    });

  }

  cargarDatosUsuario() {

    const usuarioId =
      localStorage.getItem('usuarioId');

    if (!usuarioId) return;

    this.http.get<any[]>(
      `http://localhost:8000/prestamos-usuario/${usuarioId}`
    ).subscribe({

      next: (data) => {

        this.totalPrestamos =
          data.length;

        this.prestamosActivos =
          data.length;

        this.historialLibros =
          data.map(
            p => p.libro || 'Libro'
          );

        if (data.length > 0) {

          this.ultimoPrestamo =
            data[data.length - 1].libro;

        }

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error al cargar datos usuario',
          error
        );

      }

    });

  }

}