import { Routes } from "@angular/router";


export const ADMIN_ROUTES: Routes = [
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.component').then( c => c.WelcomeComponent )},


  // Usuarios
  { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then( c => c.UsuariosComponent )},

  { path: '**', redirectTo: 'welcome' },
];
