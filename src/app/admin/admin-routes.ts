import { Routes } from "@angular/router";


export const ADMIN_ROUTES: Routes = [
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.component').then( c => c.WelcomeComponent )},


  // Usuarios
  { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then( c => c.UsuariosComponent )},

  // Membresias
  { path: 'membresias', loadComponent: () => import('./pages/membresias/membresias.component').then( c => c.MembresiasComponent )},

  // Pagos
  { path: 'pagos', loadComponent: () => import('./pages/pagos/pagos.component').then( c => c.PagosComponent )},

  // Instructores
  { path: 'instructores', loadComponent: () => import('./pages/instructores/instructores.component').then( c => c.InstructoresComponent )},

  // Clases
  { path: 'clases', loadComponent: () => import('./pages/clases/clases.component').then( c => c.ClasesComponent )},

  // Reservas
  { path: 'reservas', loadComponent: () => import('./pages/reservas/reservas.component').then( c => c.ReservasComponent )},

  // Promociónes
  { path: 'promociones', loadComponent: () => import('./pages/promociones/promociones.component').then( c => c.PromocionesComponent )},

  { path: '**', redirectTo: 'welcome' },
];
