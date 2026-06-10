import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  totalLibros = 0;
  totalUsuarios = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.cargarEstadisticas();

  }

  cargarEstadisticas() {

    this.http.get<any>(
      'http://localhost:8000/estadisticas'
    ).subscribe({

      next: (data) => {

        console.log('ESTADISTICAS:', data);

        this.totalLibros = data.libros || 0;
        this.totalUsuarios = data.usuarios || 0;
        this.prestamosActivos = data.prestamos || 0;
        this.librosDisponibles = data.disponibles || 0;

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
  fechaActual = new Date().toLocaleDateString('es-MX',{
  weekday:'long',
  year:'numeric',
  month:'long',
  day:'numeric'
});

}