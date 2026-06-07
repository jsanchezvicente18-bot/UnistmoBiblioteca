import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/layout').then(m => m.Layout),

    children: [

      {
        path: 'inicio',
        loadComponent: () =>
          import('./inicio/inicio').then(m => m.Inicio)
      },

      {
        path: 'libros',
        loadComponent: () =>
          import('./libros/libros').then(m => m.Libros)
      },

      {
        path: 'prestamos',
        loadComponent: () =>
          import('./prestamos/prestamos').then(m => m.Prestamos)
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./usuarios/usuarios').then(m => m.Usuarios)
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import('./reportes/reportes').then(m => m.Reportes)
      }

    ]
  }

];