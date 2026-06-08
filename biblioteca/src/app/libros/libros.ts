import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss'
})
export class Libros {
tipoUsuario = localStorage.getItem('tipoUsuario');
  busqueda = '';

  mostrarFormulario = false;

  nuevoLibro = {
    titulo: '',
    autor: '',
    categoria: '',
    isbn: '',
    existencias: 0
  };

  libros = [
    {
      titulo: 'Don Quijote',
      autor: 'Miguel de Cervantes',
      categoria: 'Novela',
      isbn: '978123456',
      existencias: 5
    },
    {
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      categoria: 'Novela',
      isbn: '978654321',
      existencias: 3
    }
  ];

  guardarLibro() {

    this.libros.push({
      ...this.nuevoLibro
    });

    this.nuevoLibro = {
      titulo: '',
      autor: '',
      categoria: '',
      isbn: '',
      existencias: 0
    };

    this.mostrarFormulario = false;
  }

  eliminarLibro(libro: any) {

    this.libros = this.libros.filter(
      l => l !== libro
    );
  }

  editarLibro(libro: any) {
    alert('Editar libro: ' + libro.titulo);
  }

}