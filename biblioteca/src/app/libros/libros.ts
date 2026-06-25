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

  busquedaTitulo = '';
  busquedaISBN = '';
  categoriaSeleccionada = '';

  mostrarFormulario = false;

  modalVisible = false;
  libroSeleccionado: any = null;

  nuevoLibro = {
    titulo: '',
    autor: '',
    categoria: '',
    isbn: '',
    existencias: 0
  };

  libros: any[] = [];
  favoritos: any[] = [];

  categoriasDestacadas: string[] = [
    'Programación',
    'Bases de Datos',
    'Redes',
    'IA',
    'Matemáticas',
    'Literatura'
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarLibros();
    this.obtenerFavoritos();
    this.obtenerCategoriasDestacadas();
  }

  cargarLibros() {
    this.http.get<any[]>(
      'http://localhost:8000/libros'
    ).subscribe({
      next: (data) => {
        this.libros = [...data];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar libros', error);
      }
    });
  }

  filtrarLibros() {
    return this.libros.filter(libro => {

      const coincideTitulo =
        !this.busquedaTitulo ||
        libro.titulo?.toLowerCase()
          .includes(this.busquedaTitulo.toLowerCase());

      const coincideISBN =
        !this.busquedaISBN ||
        libro.isbn?.toString()
          .includes(this.busquedaISBN);

      const coincideCategoria =
        !this.categoriaSeleccionada ||
        libro.categoria?.toLowerCase()
          .includes(this.categoriaSeleccionada.toLowerCase());

      return coincideTitulo && coincideISBN && coincideCategoria;

    });
  }

  obtenerCategoriasDestacadas() {
    this.http.get<any[]>(
      'http://localhost:8000/categorias-destacadas'
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.categoriasDestacadas = data.map(c => c.categoria);
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías destacadas', error);
      }
    });
  }

  filtrarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;

    this.http.post(
      'http://localhost:8000/categorias-buscadas',
      { categoria: categoria }
    ).subscribe({
      next: () => {
        this.obtenerCategoriasDestacadas();
      },
      error: (error) => {
        console.error('Error al guardar categoría buscada', error);
      }
    });
  }

  limpiarFiltros() {
    this.busquedaTitulo = '';
    this.busquedaISBN = '';
    this.categoriaSeleccionada = '';
  }

  obtenerFavoritos() {
    if (!this.usuarioId) {
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8000/favoritos/${this.usuarioId}`
    ).subscribe({
      next: (data) => {
        this.favoritos = data;
      },
      error: (error) => {
        console.error('Error al cargar favoritos', error);
      }
    });
  }

  agregarFavorito(libro: any) {
    if (this.tipoUsuario === 'admin') {
      alert('Los administradores no pueden agregar favoritos');
      return;
    }

    if (!this.usuarioId) {
      alert('No se encontró el usuario. Inicia sesión nuevamente');
      return;
    }

    this.http.post(
      'http://localhost:8000/favoritos',
      {
        usuario_id: this.usuarioId,
        libro_id: libro.id
      }
    ).subscribe({
      next: (respuesta: any) => {
        if (respuesta.success) {
          this.obtenerFavoritos();
          alert('Libro agregado a favoritos');
        } else {
          alert(respuesta.mensaje);
        }
      },
      error: (error) => {
        console.error('Error al agregar favorito', error);
        alert('Error al agregar favorito');
      }
    });
  }

  esFavorito(libro: any) {
    return this.favoritos.some(
      fav => fav.libro_id === libro.id
    );
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
        console.error('Error al guardar libro', error);
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
        console.error('Error al eliminar libro', error);
      }
    });
  }

  editarLibro(libro: any) {
    alert(
      'Función editar libro en desarrollo\n\n' +
      libro.titulo
    );
  }

  verDetalle(libro: any) {
    this.libroSeleccionado = libro;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.libroSeleccionado = null;
  }

}