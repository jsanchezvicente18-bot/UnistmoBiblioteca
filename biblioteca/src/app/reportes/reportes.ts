import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class Reportes {

  totalLibros = 120;
  usuariosRegistrados = 80;
  prestamosActivos = 25;
  librosPrestados = 45;

}