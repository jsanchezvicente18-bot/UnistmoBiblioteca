import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

  nombreUsuario =
    localStorage.getItem('nombreUsuario') || 'Usuario';

  tipoUsuario =
    localStorage.getItem('tipoUsuario') || '';

  fechaActual = new Date().toLocaleString(
    'es-MX',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

  paginaActual = 'Panel Principal';

  notificaciones: any[] = [];

  mostrarNotificaciones = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.cargarNotificaciones();

  }

  toggleDarkMode() {

    document.body.classList.toggle(
      'dark-mode'
    );

  }

  cerrarSesion() {

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);

  }

  cargarNotificaciones() {

    const usuarioId =
      localStorage.getItem('usuarioId');

    if (!usuarioId) return;

    this.http.get<any[]>(
      `http://localhost:8000/notificaciones/${usuarioId}`
    ).subscribe({

      next: (data) => {

        this.notificaciones = data;

      },

      error: (error) => {

        console.error(
          'Error al cargar notificaciones',
          error
        );

      }

    });

  }

  abrirNotificaciones() {

    this.mostrarNotificaciones =
      !this.mostrarNotificaciones;

    if (this.mostrarNotificaciones) {

      this.cargarNotificaciones();

    }

  }

  marcarComoLeida(id: string) {

    this.http.put(
      `http://localhost:8000/notificaciones/${id}/leer`,
      {}
    ).subscribe({

      next: () => {

        this.cargarNotificaciones();

      },

      error: (error) => {

        console.error(
          'Error al marcar notificación',
          error
        );

      }

    });

  }

  get totalNoLeidas() {

    return this.notificaciones.filter(
      n => !n.leida
    ).length;

  }

}