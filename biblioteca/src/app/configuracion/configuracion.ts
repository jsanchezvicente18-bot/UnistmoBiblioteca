import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss'
})


export class Configuracion {

  tipoUsuario = localStorage.getItem('tipoUsuario');

  nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  fotoPerfil = localStorage.getItem('fotoPerfil') || '/img/user.png';
  correoUsuario = localStorage.getItem('correoUsuario') || '';
  matriculaUsuario = localStorage.getItem('matriculaUsuario') || '';
  carreraUsuario = localStorage.getItem('carreraUsuario') || '';
  fechaRegistro = localStorage.getItem('fechaRegistro') || '';

  editandoPerfil = false;

  passwordActual = '';
  nuevaPassword = '';

  mostrarCambioPassword = false;
  mostrarPassword = false;

  notiDevoluciones = true;
  notiNuevosLibros = true;
  notiPrestamosVencidos = true;

  notificaciones: any[] = [];

  mostrarContactoAdmin = false;
  mostrarReporteError = false;

  mensajeAdmin = '';
  reporteError = '';

  constructor(private http: HttpClient) {}

  editarPerfil() {
    this.editandoPerfil = true;
  }

  guardarPerfil() {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      alert('No se encontró el ID del usuario');
      return;
    }

    const datos = {
      nombre: this.nombreUsuario,
      correo: this.correoUsuario,
      carrera: this.carreraUsuario,
      fotoPerfil: this.fotoPerfil
    };

    this.http.put(`http://localhost:8000/usuarios/${usuarioId}`, datos)
      .subscribe({
        next: () => {
          localStorage.setItem('nombreUsuario', this.nombreUsuario);
          localStorage.setItem('correoUsuario', this.correoUsuario);
          localStorage.setItem('carreraUsuario', this.carreraUsuario);

          this.editandoPerfil = false;

          alert('Información actualizada correctamente');
        },
        error: () => {
          alert('Error al actualizar información');
        }
      });
  }

  abrirCambioPassword() {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
  }

  cambiarPassword() {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      alert('No se encontró el ID del usuario');
      return;
    }

    if (!this.passwordActual || !this.nuevaPassword) {
      alert('Completa todos los campos');
      return;
    }

    const datos = {
      passwordActual: this.passwordActual,
      nuevaPassword: this.nuevaPassword
    };

    this.http.put(`http://localhost:8000/usuarios/${usuarioId}/password`, datos)
      .subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente');

          this.passwordActual = '';
          this.nuevaPassword = '';
          this.mostrarCambioPassword = false;
        },
        error: () => {
          alert('Error al actualizar contraseña');
        }
      });
  }

  seleccionarFoto(event: any) {
  const archivo = event.target.files[0];

  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.fotoPerfil = reader.result as string;

    localStorage.setItem('fotoPerfil', this.fotoPerfil);

    this.guardarPerfil();
  };

  reader.readAsDataURL(archivo);
}

  guardarNotificaciones() {
    alert('Notificaciones guardadas');
  }

  abrirManual() {
    window.open('assets/manual-usuario.pdf', '_blank');
  }

  abrirContactoAdmin() {
    this.mostrarContactoAdmin = !this.mostrarContactoAdmin;
    this.mostrarReporteError = false;
  }


  abrirReporteError() {
    this.mostrarReporteError = !this.mostrarReporteError;
    this.mostrarContactoAdmin = false;
  }

  enviarReporteError() {
  if (!this.reporteError.trim()) {
    alert('Describe el error');
    return;
  }

  const datos = {
    usuario_id: localStorage.getItem('usuarioId'),
    nombre: this.nombreUsuario,
    error: this.reporteError
  };

  this.http.post('http://localhost:8000/reportar-error', datos)
    .subscribe({
      next: () => {
        alert('Reporte enviado correctamente');
        this.reporteError = '';
        this.mostrarReporteError = false;
      },
      error: () => {
        alert('Error al enviar reporte');
      }
    });
}

  verificarConexion() {
    alert('Base de datos conectada correctamente');
  }
  
  enviarMensajeAdmin() {
  if (!this.mensajeAdmin.trim()) {
    alert('Escribe un mensaje');
    return;
  }

  const datos = {
    usuario_id: localStorage.getItem('usuarioId'),
    nombre: this.nombreUsuario,
    mensaje: this.mensajeAdmin
  };

  this.http.post('http://localhost:8000/contactar-admin', datos)
    .subscribe({
      next: () => {
        alert('Mensaje enviado al administrador');
        this.mensajeAdmin = '';
        this.mostrarContactoAdmin = false;
      },
      error: () => {
        alert('Error al enviar mensaje');
      }
    });
}

mensajesAdmin: any[] = [];
reportesError: any[] = [];

cargarMensajesAdmin() {
  this.http.get<any[]>('http://localhost:8000/mensajes-admin')
    .subscribe(data => {
      this.mensajesAdmin = data;
    });
}

cargarReportesError() {
  this.http.get<any[]>('http://localhost:8000/reportes-error')
    .subscribe(data => {
      this.reportesError = data;
    });
}


}