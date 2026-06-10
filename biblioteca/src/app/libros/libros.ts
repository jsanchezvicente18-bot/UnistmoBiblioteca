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

  tipoUsuario = localStorage.getItem('tipoUsuario');
  
ngOnInit() {
  console.log('TIPO USUARIO:', this.tipoUsuario);
  console.log('ENTRÓ A NGONINIT');
  this.cargarLibros();
}

  
  constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef
) {}

  busqueda = '';

  mostrarFormulario = false;

  nuevoLibro = {
    titulo: '',
    autor: '',
    categoria: '',
    isbn: '',
    existencias: 0
  };

  libros: any[] = [];

 

cargarLibros() {

  this.http.get<any[]>('http://127.0.0.1:8000/libros')
    .subscribe({
      next: (data) => {
        this.libros = [...data];
        this.cdr.detectChanges();
        
      },
      error: (error) => {
        console.error(error);
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
        console.error('Error al guardar libro:', error);
      }
    });

  }

  eliminarLibro(libro: any) {

    this.http.delete(
      `http://localhost:8000/libros/${libro.id}`
    ).subscribe({
      next: () => {
        this.cargarLibros();
      },
      error: (error) => {
        console.error('Error al eliminar libro:', error);
      }
    });

  }

  editarLibro(libro: any) {
    alert('Editar libro: ' + libro.titulo);
  }

}