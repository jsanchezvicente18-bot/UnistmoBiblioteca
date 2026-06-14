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

tipoUsuario =
localStorage.getItem('tipoUsuario');

nombreUsuario =
localStorage.getItem('nombreUsuario') || '';

matriculaUsuario =
localStorage.getItem('matriculaUsuario') || '';

correoUsuario =
localStorage.getItem('correoUsuario') || '';

carreraUsuario =
localStorage.getItem('carreraUsuario') || '';

mostrarFormulario = false;

usuarios: any[] = [];

misPrestamos: any[] = [];

historialLibros: string[] = [];

favoritos: string[] = [];

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


console.log('ENTRÓ A USUARIOS');

if (this.tipoUsuario === 'admin') {

  this.cargarUsuarios();

}

this.cargarDatosUsuario();


}

cargarDatosUsuario() {


this.misPrestamos = [];

this.historialLibros = [];

this.favoritos = [];


}

cargarUsuarios() {


console.log('Cargando usuarios...');

this.http.get<any[]>(
  'http://localhost:8000/usuarios'
).subscribe({

  next: (data) => {

    console.log(
      'Usuarios recibidos:',
      data
    );

    this.usuarios = [...data];

    this.cdr.detectChanges();

    console.log(
      'Total:',
      this.usuarios.length
    );

  },

  error: (error) => {

    console.error(
      'Error al cargar usuarios',
      error
    );

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

    console.error(
      'Error al guardar usuario',
      error
    );

  }

});

}

eliminarUsuario(usuario: any) {

this.usuarios =
  this.usuarios.filter(
    u => u !== usuario
  );

}

editarUsuario(usuario: any) {

alert(
  'Editar usuario: ' +
  usuario.nombre
);

}

bloquearUsuario(usuario: any) {

alert(
  'Usuario bloqueado: ' +
  usuario.nombre
);


}

}
