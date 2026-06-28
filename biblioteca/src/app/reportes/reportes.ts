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

  tipoUsuario = localStorage.getItem('tipoUsuario') || '';
  usuarioId = localStorage.getItem('usuarioId') || '';

  totalLibros = 0;
  usuariosRegistrados = 0;
  prestamosActivos = 0;
  prestamosVencidos = 0;
  librosDisponibles = 0;

  librosMasPrestados: string[] = [];
  usuariosActivos: string[] = [];
  actividadReciente: string[] = [];

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

    if (this.tipoUsuario === 'admin') {
      this.cargarEstadisticasAdmin();
    } else {
      this.cargarDatosUsuario();
      this.cargarFavoritosUsuario();
    }

  }

  cargarEstadisticasAdmin() {

    this.http.get<any>('http://localhost:8000/estadisticas')
      .subscribe({
        next: (data) => {

          this.totalLibros = data.libros || 0;
          this.usuariosRegistrados = data.usuarios || 0;
          this.prestamosActivos = data.prestamos || 0;
          this.librosDisponibles = data.disponibles || 0;
          this.prestamosVencidos = data.vencidos || 0;

          this.librosMasPrestados = data.librosMasPrestados || [];
          this.usuariosActivos = data.usuariosActivos || [];
          this.actividadReciente = data.actividadReciente || [];

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error('Error al cargar estadísticas admin', error);
        }
      });

  }

  cargarDatosUsuario() {

    if (!this.usuarioId) {
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8000/prestamos-usuario/${this.usuarioId}`
    ).subscribe({
      next: (data) => {

        const prestamos = data || [];

        this.totalPrestamos = prestamos.length;

        this.prestamosActivos = prestamos.filter(p =>
          this.obtenerEstadoPrestamo(p) === 'Activo'
        ).length;

        this.prestamosVencidos = prestamos.filter(p =>
          this.obtenerEstadoPrestamo(p) === 'Vencido'
        ).length;

        this.librosDevueltos = prestamos.filter(p =>
          this.obtenerEstadoPrestamo(p) === 'Devuelto'
        ).length;

        this.historialLibros = prestamos.map(p =>
          p.libro || p.titulo || 'Libro sin nombre'
        );

        if (prestamos.length > 0) {
          const ultimo = prestamos[prestamos.length - 1];
          this.ultimoPrestamo = ultimo.libro || ultimo.titulo || 'Sin datos';
        } else {
          this.ultimoPrestamo = 'Sin datos';
        }

        this.libroFavorito = this.obtenerLibroMasSolicitado(prestamos);

        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Error al cargar datos usuario', error);
      }
    });

  }

  cargarFavoritosUsuario() {

    if (!this.usuarioId) {
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8000/favoritos/${this.usuarioId}`
    ).subscribe({
      next: (data) => {
        this.favoritos = data ? data.length : 0;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar favoritos', error);
        this.favoritos = 0;
      }
    });

  }

  obtenerEstadoPrestamo(prestamo: any): string {

    if (prestamo.estado) {
      const estado = prestamo.estado.toString().toLowerCase();

      if (estado.includes('devuelto')) {
        return 'Devuelto';
      }

      if (estado.includes('vencido')) {
        return 'Vencido';
      }

      if (estado.includes('activo')) {
        return 'Activo';
      }
    }

    const fechaDevolucion =
      prestamo.fechaDevolucion ||
      prestamo.fecha_devolucion ||
      prestamo.fecha_devolucion_estimada;

    if (!fechaDevolucion) {
      return 'Activo';
    }

    const hoy = new Date();
    const fecha = new Date(fechaDevolucion);

    if (fecha < hoy) {
      return 'Vencido';
    }

    return 'Activo';

  }

  obtenerLibroMasSolicitado(prestamos: any[]): string {

    if (!prestamos || prestamos.length === 0) {
      return 'Sin datos';
    }

    const contador: any = {};

    prestamos.forEach(p => {
      const libro = p.libro || p.titulo || 'Libro sin nombre';
      contador[libro] = (contador[libro] || 0) + 1;
    });

    let libroTop = 'Sin datos';
    let max = 0;

    Object.keys(contador).forEach(libro => {
      if (contador[libro] > max) {
        max = contador[libro];
        libroTop = libro;
      }
    });

    return libroTop;

  }

}