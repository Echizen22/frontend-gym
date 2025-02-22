import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

import { PUBLIC_ROUTES } from './public/public-routes';
import { PRIVATE_ROUTES } from './private/private-routes';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: 'private',
    children: PRIVATE_ROUTES
  }
];
