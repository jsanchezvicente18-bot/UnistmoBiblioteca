import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios {

  usuarios = [
    {
      nombre: 'Juan',
      apellidos: 'Pérez López',
      matricula: '2024001',
      carrera: 'Ingeniería en Computación',
      correo: 'juan@unistmo.edu.mx'
    },
    {
      nombre: 'María',
      apellidos: 'García Ruiz',
      matricula: '2024002',
      carrera: 'Ingeniería en Computación',
      correo: 'maria@unistmo.edu.mx'
    }
  ];

}