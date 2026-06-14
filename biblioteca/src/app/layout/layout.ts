import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';

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

  totalNotificaciones = 3;

  constructor(private router: Router) {}

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

}