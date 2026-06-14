import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss'
})
export class Libros implements OnInit {

  tipoUsuario = localStorage.getItem('tipoUsuario') || '';
  usuarioId = localStorage.getItem('usuarioId') || '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // BUSCADORES
  busquedaTitulo = '';
  busquedaAutor = '';
  busquedaCategoria = '';
  busquedaISBN = '';

  categoriaSeleccionada = '';

  mostrarFormulario = false;

  nuevoLibro = {
    titulo: '',
    autor: '',
    categoria: '',
    isbn: '',
    existencias: 0
  };

  libros: any[] = [];
  librosFiltrados: any[] = [];

  favoritos: any[] = [];

  ngOnInit() {

    console.log('TIPO USUARIO:', this.tipoUsuario);

    this.cargarLibros();

    const favoritosGuardados =
      localStorage.getItem('favoritos');

    if (favoritosGuardados) {

      this.favoritos =
        JSON.parse(favoritosGuardados);

    }

  }

  cargarLibros() {

    this.http.get<any[]>(
      'http://localhost:8000/libros'
    ).subscribe({

      next: (data) => {

        this.libros = [...data];
        this.librosFiltrados = [...data];

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error al cargar libros',
          error
        );

      }

    });

  }

  guardarLibro() {

    this.http.post(
      'http://localhost:8000/libros',
      this.nuevoLibro
    ).subscribe({

      next: () => {

        this.cargarLibros();

        this.nuevoLibro = {
          titulo: '',
          autor: '',
          categoria: '',
          isbn: '',
          existencias: 0
        };

        this.mostrarFormulario = false;

      },

      error: (error) => {

        console.error(
          'Error al guardar libro',
          error
        );

      }

    });

  }

  eliminarLibro(libro: any) {

    if (!confirm('¿Eliminar libro?')) {
      return;
    }

    this.http.delete(
      `http://localhost:8000/libros/${libro.id}`
    ).subscribe({

      next: () => {

        this.cargarLibros();

      },

      error: (error) => {

        console.error(
          'Error al eliminar libro',
          error
        );

      }

    });

  }

  editarLibro(libro: any) {

    alert(
      'Función editar libro en desarrollo\n\n' +
      libro.titulo
    );

  }

  // ==========================
  // BUSQUEDA GENERAL
  // ==========================

 filtrarLibros() {

  return this.libros.filter(libro => {

    const coincideTitulo =
      !this.busquedaTitulo ||
      libro.titulo?.toLowerCase()
      .includes(this.busquedaTitulo.toLowerCase());

    const coincideAutor =
      !this.busquedaAutor ||
      libro.autor?.toLowerCase()
      .includes(this.busquedaAutor.toLowerCase());

    const coincideCategoria =
      !this.busquedaCategoria ||
      libro.categoria?.toLowerCase()
      .includes(this.busquedaCategoria.toLowerCase());

    const coincideISBN =
      !this.busquedaISBN ||
      libro.isbn?.toString()
      .includes(this.busquedaISBN);

    return (
      coincideTitulo &&
      coincideAutor &&
      coincideCategoria &&
      coincideISBN
    );

  });

}

  // ==========================
  // FILTRAR CATEGORIA
  // ==========================

  filtrarCategoria(categoria: string) {

    this.categoriaSeleccionada = categoria;

    this.librosFiltrados =
      this.libros.filter(
        libro =>
          libro.categoria?.toLowerCase()
          .includes(categoria.toLowerCase())
      );

  }

  // ==========================
  // LIMPIAR FILTROS
  // ==========================

  limpiarFiltros() {

    this.busquedaTitulo = '';
    this.busquedaAutor = '';
    this.busquedaCategoria = '';
    this.busquedaISBN = '';

    this.categoriaSeleccionada = '';

    this.librosFiltrados =
      [...this.libros];

  }

  // ==========================
  // FAVORITOS
  // ==========================

  agregarFavorito(libro: any) {

    const existe =
      this.favoritos.find(
        l => l.id === libro.id
      );

    if (existe) {

      alert(
        'Este libro ya está en favoritos'
      );

      return;

    }

    this.favoritos.push(libro);

    localStorage.setItem(
      'favoritos',
      JSON.stringify(this.favoritos)
    );

    alert(
      'Libro agregado a favoritos'
    );

  }

  // ==========================
  // DETALLE LIBRO
  // ==========================

  verDetalle(libro: any) {

    alert(
      'Título: ' + libro.titulo +
      '\nAutor: ' + libro.autor +
      '\nCategoría: ' + libro.categoria +
      '\nISBN: ' + libro.isbn +
      '\nExistencias: ' + libro.existencias
    );

  }

  // ==========================
  // SOLICITAR PRESTAMO
  // ==========================

  solicitarPrestamo(libro: any) {

    if (this.tipoUsuario === 'admin') {

      alert(
        'Los administradores no pueden solicitar préstamos'
      );

      return;

    }

    const usuarioId =
      localStorage.getItem('usuarioId');

    this.http.post(
      'http://localhost:8000/prestamos',
      {
        usuario_id: usuarioId,
        libro_id: libro.id
      }
    ).subscribe({

      next: () => {

        alert(
          'Préstamo solicitado correctamente'
        );

      },

      error: (error) => {

        console.error(error);

        alert(
          'Error al solicitar préstamo'
        );

      }

    });

  }

}