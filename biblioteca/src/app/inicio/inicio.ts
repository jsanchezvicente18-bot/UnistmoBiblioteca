import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {

  totalLibros = 0;
  totalUsuarios = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;
  
   tipoUsuario = localStorage.getItem('tipoUsuario');

}