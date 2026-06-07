import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libros as LibrosService } from '../services/libros';


@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss'
})
export class Libros {

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

}