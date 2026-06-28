import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {

  tipoUsuario = localStorage.getItem('tipoUsuario') || '';

  usuarioId = localStorage.getItem('usuarioId') || '';
  nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  matriculaUsuario = localStorage.getItem('matriculaUsuario') || '';
  correoUsuario = localStorage.getItem('correoUsuario') || '';
  carreraUsuario = localStorage.getItem('carreraUsuario') || '';

  mostrarFormulario = false;

  usuarios: any[] = [];
  misPrestamos: any[] = [];
  historialLibros: any[] = [];
  favoritos: any[] = [];

  nuevoUsuario = {
    nombre: '',
    matricula: '',
    carrera: '',
    correo: '',
    telefono: '',
    password: '',
    tipo: 'estudiante'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    if (this.tipoUsuario === 'admin') {
      this.cargarUsuarios();
    } else {
      this.cargarDatosUsuario();
    }

  }

  cargarDatosUsuario() {
    this.cargarMisPrestamos();
    this.cargarFavoritos();
  }

  cargarMisPrestamos() {

    if (!this.usuarioId) {
      this.misPrestamos = [];
      this.historialLibros = [];
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8000/prestamos-usuario/${this.usuarioId}`
    ).subscribe({
      next: (data) => {

        console.log('Préstamos usuario:', data);

        this.misPrestamos = data || [];

        this.historialLibros = this.misPrestamos.map(p => ({
          titulo: p.libro || p.titulo || 'Sin título',
          autor: p.autor || 'No disponible',
          categoria: p.categoria || 'No disponible',
          isbn: p.isbn || 'No disponible'
        }));

        this.cdr.detectChanges();

      },
      error: (error) => {

        console.error('Error al cargar préstamos del usuario:', error);

        this.misPrestamos = [];
        this.historialLibros = [];

      }
    });

  }

  cargarFavoritos() {

    if (!this.usuarioId) {
      this.favoritos = [];
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8000/favoritos/${this.usuarioId}`
    ).subscribe({
      next: (data) => {

        console.log('Favoritos usuario:', data);

        this.favoritos = data || [];

        this.cdr.detectChanges();

      },
      error: (error) => {

        console.error('Error al cargar favoritos del usuario:', error);

        this.favoritos = [];

      }
    });

  }

  cargarUsuarios() {

    this.http.get<any[]>(
      'http://localhost:8000/usuarios'
    ).subscribe({
      next: (data) => {

        this.usuarios = [...data];

        this.cdr.detectChanges();

      },
      error: (error) => {

        console.error('Error al cargar usuarios', error);

      }
    });

  }

  guardarUsuario() {

    this.http.post(
      'http://localhost:8000/usuarios',
      this.nuevoUsuario
    ).subscribe({
      next: () => {

        this.cargarUsuarios();

        this.nuevoUsuario = {
          nombre: '',
          matricula: '',
          carrera: '',
          correo: '',
          telefono: '',
          password: '',
          tipo: 'estudiante'
        };

        this.mostrarFormulario = false;

      },
      error: (error) => {

        console.error('Error al guardar usuario', error);

      }
    });

  }

  eliminarUsuario(usuario: any) {
    this.usuarios = this.usuarios.filter(u => u !== usuario);
  }

  editarUsuario(usuario: any) {
    alert('Editar usuario: ' + usuario.nombre);
  }

  bloquearUsuario(usuario: any) {
    alert('Usuario bloqueado: ' + usuario.nombre);
  }

}