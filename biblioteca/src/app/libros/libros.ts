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

    const favoritosGuardados =
      localStorage.getItem('favoritos');

    if (favoritosGuardados) {
      this.favoritos = JSON.parse(favoritosGuardados);
    }

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

        console.error(
          'Error al cargar libros',
          error
        );

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

      return (
        coincideTitulo &&
        coincideISBN &&
        coincideCategoria
      );

    });

  }

  filtrarCategoria(categoria: string) {

    this.categoriaSeleccionada = categoria;

    this.guardarBusquedaCategoria(categoria);

  }

  guardarBusquedaCategoria(categoria: string) {

    const datos =
      JSON.parse(
        localStorage.getItem('categoriasBuscadas') || '{}'
      );

    datos[categoria] = (datos[categoria] || 0) + 1;

    localStorage.setItem(
      'categoriasBuscadas',
      JSON.stringify(datos)
    );

    this.actualizarCategoriasDestacadas();

  }

  actualizarCategoriasDestacadas() {

    const datos =
      JSON.parse(
        localStorage.getItem('categoriasBuscadas') || '{}'
      );

    const categoriasOrdenadas =
      Object.keys(datos)
      .sort((a, b) => datos[b] - datos[a]);

    if (categoriasOrdenadas.length > 0) {
      this.categoriasDestacadas = categoriasOrdenadas;
    }

  }

  limpiarFiltros() {

    this.busquedaTitulo = '';
    this.busquedaISBN = '';
    this.categoriaSeleccionada = '';

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

  agregarFavorito(libro: any) {

    const existe =
      this.favoritos.find(
        l => l.id === libro.id
      );

    if (existe) {

      alert('Este libro ya está en favoritos');
      return;

    }

    this.favoritos.push(libro);

    localStorage.setItem(
      'favoritos',
      JSON.stringify(this.favoritos)
    );

    alert('Libro agregado a favoritos');

  }


  solicitarPrestamo(libro: any) {

    if (this.tipoUsuario === 'admin') {

      alert(
        'Los administradores no pueden solicitar préstamos'
      );

      return;

    }

    if (libro.existencias <= 0) {

      alert(
        'Este libro está agotado'
      );

      return;

    }

    this.http.post(
      'http://localhost:8000/prestamos',
      {
        usuario_id: this.usuarioId,
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
  modalVisible = false;
libroSeleccionado: any = null;

verDetalle(libro: any) {
  this.libroSeleccionado = libro;
  this.modalVisible = true;
}

cerrarModal() {
  this.modalVisible = false;
  this.libroSeleccionado = null;
}

}