import { Routes } from '@angular/router';

import { PUBLIC_ROUTES } from './public/public-routes';
import { ADMIN_ROUTES } from './admin/admin-routes';
import { USER_ROUTES } from './user/user-routes';
import { authAdminGuard, authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: 'user',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: USER_ROUTES
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authAdminGuard],
    children: ADMIN_ROUTES
  }
];
