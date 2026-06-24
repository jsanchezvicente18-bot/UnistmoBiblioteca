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
  tipoUsuario = localStorage.getItem('tipoUsuario');

  busqueda = '';

  prestamos: any[] = [];
  usuarios: any[] = [];
  libros: any[] = [];

  mostrarFormulario = false;

  prestamoSeleccionado: any = null;
  mostrarDetalle = false;

  prestamoRenovar: any = null;
  mostrarRenovar = false;

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
    this.usuarioLogueado = localStorage.getItem('usuarioId') || '';
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';

    this.cargarPrestamos();

    if (this.tipoUsuario === 'admin') {
      this.cargarUsuarios();
    }

    this.cargarLibros();
  }

  cargarPrestamos() {
    const url = this.tipoUsuario === 'admin'
      ? 'http://localhost:8000/prestamos-detalle'
      : `http://localhost:8000/prestamos-usuario/${this.usuarioLogueado}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.prestamos = data || [];
        this.calcularEstadisticas();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar préstamos', error);
      }
    });
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:8000/usuarios')
      .subscribe({
        next: (data) => {
          this.usuarios = data || [];
        },
        error: (error) => {
          console.error('Error al cargar usuarios', error);
        }
      });
  }

  cargarLibros() {
    this.http.get<any[]>('http://localhost:8000/libros')
      .subscribe({
        next: (data) => {
          this.libros = data || [];
        },
        error: (error) => {
          console.error('Error al cargar libros', error);
        }
      });
  }

  guardarPrestamo() {
    if (this.tipoUsuario !== 'admin') {
      this.nuevoPrestamo.usuario_id = this.usuarioLogueado;
    }

    if (!this.nuevoPrestamo.usuario_id || !this.nuevoPrestamo.libro_id) {
      alert('Selecciona usuario y libro');
      return;
    }

    this.http.post('http://localhost:8000/prestamos', this.nuevoPrestamo)
      .subscribe({
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

  get prestamosFiltrados() {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) return this.prestamos;

    return this.prestamos.filter(p =>
      (p.libro || '').toLowerCase().includes(texto) ||
      (p.usuario || '').toLowerCase().includes(texto)
    );
  }

  get prestamosActivos() {
    return this.prestamos.filter(p => this.obtenerEstado(p) === 'Activo').length;
  }

  get prestamosVencidos() {
    return this.prestamos.filter(p => this.obtenerEstado(p) === 'Vencido').length;
  }

  horasRestantes(prestamo: any) {
    if (!prestamo || !prestamo.fecha_devolucion) return 0;

    const ahora = new Date();

    const devolucion = new Date(
      prestamo.fecha_devolucion + 'T23:59:59'
    );

    const diferencia = devolucion.getTime() - ahora.getTime();

    const horas = Math.ceil(diferencia / (1000 * 60 * 60));

    return horas > 0 ? horas : 0;
  }

  obtenerEstado(prestamo: any) {
    const horas = this.horasRestantes(prestamo);

    if (horas <= 0) {
      return 'Vencido';
    }

    return 'Activo';
  }

  verDetalle(prestamo: any) {
    this.prestamoSeleccionado = prestamo;
    this.mostrarDetalle = true;
  }

  cerrarDetalle() {
    this.prestamoSeleccionado = null;
    this.mostrarDetalle = false;
  }

  renovarPrestamo(prestamo: any) {
    this.prestamoRenovar = prestamo;
    this.mostrarRenovar = true;
  }

  cerrarRenovar() {
    this.prestamoRenovar = null;
    this.mostrarRenovar = false;
  }

  confirmarRenovar() {
    if (!this.prestamoRenovar) return;

    alert('Renovación pendiente de conectar al backend');

    this.cerrarRenovar();
  }

  calcularEstadisticas() {
    if (this.prestamos.length === 0) {
      this.usuarioTop = 'Sin datos';
      this.libroTop = 'Sin datos';
      return;
    }

    const conteoLibros: any = {};
    const conteoUsuarios: any = {};

    this.prestamos.forEach(p => {
      const libro = p.libro || 'Sin libro';
      const usuario = p.usuario || 'Sin usuario';

      conteoLibros[libro] = (conteoLibros[libro] || 0) + 1;
      conteoUsuarios[usuario] = (conteoUsuarios[usuario] || 0) + 1;
    });

    this.libroTop = Object.keys(conteoLibros).sort(
      (a, b) => conteoLibros[b] - conteoLibros[a]
    )[0];

    this.usuarioTop = Object.keys(conteoUsuarios).sort(
      (a, b) => conteoUsuarios[b] - conteoUsuarios[a]
    )[0];
  }

}