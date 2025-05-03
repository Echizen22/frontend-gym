import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

import { PUBLIC_ROUTES } from './public/public-routes';
import { ADMIN_ROUTES } from './admin/admin-routes';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { USER_ROUTES } from './user/user-routes';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: 'user',
    component: PublicLayoutComponent,
    children: USER_ROUTES
  },
  {
    path: 'admin',
    component: PrivateLayoutComponent,
    children: ADMIN_ROUTES
  }
];
