import { Component, computed, inject, OnInit } from '@angular/core';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
  ],
  providers: [
    AuthService
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

  private readonly authService = inject(AuthService);


  public menuItems = computed<MenuItem[]>(() => {
    const baseItems = [
      { label: 'Inicio', routerLink: '/' },
      { label: 'About', routerLink: '/about' },
      { label: 'Contacto', routerLink: '/contacto' }
    ];

    console.log('public-layout: ' + this.authService.isLoggedIn())
    const clasesItem = this.authService.isLoggedIn()
      ? { label: 'Mis Clases', routerLink: '/user/mis-clases' }
      : { label: 'Clases', routerLink: '/clases' };

    return [...baseItems, clasesItem];
  });



}
