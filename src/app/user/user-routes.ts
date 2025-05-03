import { Routes } from "@angular/router";


export const USER_ROUTES: Routes = [
  { path: 'mi-perfil', loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then( c => c.MiPerfilComponent )},
  { path: 'mis-clases', loadComponent: () => import('./pages/mis-clases/mis-clases.component').then( c => c.MisClasesComponent )},
];
