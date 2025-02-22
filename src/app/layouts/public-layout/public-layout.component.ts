import { Component } from '@angular/core';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    HeaderComponent,

    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

  public menuItem: MenuItem[] = [{
    label: 'Inicio',
    routerLink: '/'
  },
  {
    label: 'About',
    routerLink: '/about'
  },
  {
    label: 'Contacto',
    routerLink: 'contacto'
  },
  {
    label: 'Clases',
    routerLink: 'clases'
  }
];

}
