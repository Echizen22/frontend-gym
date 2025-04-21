import { Routes } from "@angular/router";


export const PUBLIC_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/inicio/inicio.component').then( c => c.InicioComponent )},
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then( c => c.AboutComponent )},
  { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto.component').then( c => c.ContactoComponent )},
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then( c => c.LoginComponent )}
];
