import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.scss'
})
export class Prestamos {

  prestamos = [
    {
      usuario: 'Juan Pérez',
      libro: 'Don Quijote',
      fechaPrestamo: '07/06/2026',
      fechaDevolucion: '14/06/2026',
      estado: 'Activo'
    },
    {
      usuario: 'María García',
      libro: 'Cien años de soledad',
      fechaPrestamo: '05/06/2026',
      fechaDevolucion: '12/06/2026',
      estado: 'Devuelto'
    }
  ];

}