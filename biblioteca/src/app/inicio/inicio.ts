import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-inicio',
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})


export class Inicio implements OnInit {

  constructor(private http: HttpClient) {}

  totalLibros = 0;
  totalUsuarios = 0;
  prestamosActivos = 0;
  librosDisponibles = 0;

  tipoUsuario = localStorage.getItem('tipoUsuario');

  ngOnInit() {

    this.http.get<any>(
      'http://localhost:8000/estadisticas'
    ).subscribe({

      next: (data) => {

        this.totalLibros = data.libros;
        this.totalUsuarios = data.usuarios;
        this.prestamosActivos = data.prestamos;
        this.librosDisponibles = data.disponibles;

      }

    });

  }

}
