import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})

export class Layout {

  constructor(private router: Router) {}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}