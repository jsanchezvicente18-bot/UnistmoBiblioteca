import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class Reportes implements OnInit {

  totalLibros = 0;
  usuariosRegistrados = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;

  constructor( private http: HttpClient,
  private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {

    this.http.get<any>(
      'http://localhost:8000/estadisticas'
    ).subscribe({

      next: (data) => {
        this.totalLibros = data.libros;
        this.usuariosRegistrados = data.usuarios;
        this.prestamosActivos = data.prestamos;
        this.librosDisponibles = data.disponibles;
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

}