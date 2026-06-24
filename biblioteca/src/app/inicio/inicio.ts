import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  totalLibros = 0;
  totalUsuarios = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;

  nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
  tipoUsuario = localStorage.getItem('tipoUsuario') || '';

  fechaActual = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  totalPrestamos = 0;
  ultimoLibro = 'Sin préstamos';

  misLibros: string[] = [];
  proximasDevoluciones: string[] = [];
  librosPopulares: string[] = [];

  busqueda = '';
  libros: any[] = [];
  librosFiltrados: any[] = [];

  categoriasDestacadas: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarLibros();
    this.cargarCategoriasDestacadas();
  }

  cargarEstadisticas() {
    this.http.get<any>('http://localhost:8000/estadisticas')
      .subscribe({
        next: (data) => {
          this.totalLibros = data.libros || 0;
          this.totalUsuarios = data.usuarios || 0;
          this.prestamosActivos = data.prestamos || 0;
          this.librosDisponibles = data.disponibles || 0;

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar estadísticas', error);
        }
      });
  }

  cargarLibros() {
    this.http.get<any[]>('http://localhost:8000/libros')
      .subscribe({
        next: (data) => {
          this.libros = data;
        },
        error: (error) => {
          console.error('Error al cargar libros', error);
        }
      });
  }

  buscarLibros() {
    const texto = this.busqueda.toLowerCase().trim();

    if (texto === '') {
      this.librosFiltrados = [];
      return;
    }

    this.librosFiltrados = this.libros.filter(libro =>
      (libro.titulo || '').toLowerCase().includes(texto) ||
      (libro.autor || '').toLowerCase().includes(texto) ||
      (libro.categoria || '').toLowerCase().includes(texto)
    );
  }

  cargarCategoriasDestacadas() {
    this.http.get<any[]>('http://localhost:8000/categorias-destacadas')
      .subscribe({
        next: (data) => {
          this.categoriasDestacadas = data;
        },
        error: (error) => {
          console.error('Error al cargar categorías destacadas', error);
        }
      });
  }

  buscarPorCategoria(categoria: string) {
    this.busqueda = categoria;
    this.buscarLibros();
  }
  
  libroSeleccionado: any = null;

seleccionarLibro(libro: any) {
  this.libroSeleccionado = libro;
}

}