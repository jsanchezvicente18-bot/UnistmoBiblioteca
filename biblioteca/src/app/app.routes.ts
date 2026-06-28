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
    path: 'registro',
    loadComponent: () =>
      import('./registro/registro').then(m => m.Registro)
  },

  {
    path: 'recuperar-password',
    loadComponent: () =>
      import('./pages/recuperar-password/recuperar-password')
        .then(m => m.RecuperarPassword)
  },

  {
    path: 'manual-usuario',
    loadComponent: () =>
      import('./pages/manual-usuario/manual-usuario')
        .then(m => m.ManualUsuario)
  },

  {
    path: 'contactar-admin',
    loadComponent: () =>
      import('./pages/contactar-admin/contactar-admin')
        .then(m => m.ContactarAdmin)
  },

  {
    path: 'mandar-reporte',
    loadComponent: () =>
      import('./pages/mandar-reporte/mandar-reporte')
        .then(m => m.MandarReporte)
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
        path: 'usuarios',
        loadComponent: () =>
          import('./usuarios/usuarios').then(m => m.Usuarios)
      },

      {
        path: 'prestamos',
        loadComponent: () =>
          import('./prestamos/prestamos').then(m => m.Prestamos)
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import('./reportes/reportes').then(m => m.Reportes)
      },

      {
        path: 'configuracion',
        loadComponent: () =>
          import('./configuracion/configuracion').then(m => m.Configuracion)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];