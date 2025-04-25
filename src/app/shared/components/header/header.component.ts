import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {


  private readonly authService: AuthService = inject(AuthService);

  private _isAdmin = signal<boolean>(false);
  itemsLogin: MenuItem[] = [
    {
      label: 'Options',
      items: [
          {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => this.authService.logout()
          }
      ]
    }
  ];


  @Input()
  menuItems!: MenuItem[];

  get isAdmin() {
    return this._isAdmin();
  }


  ngOnInit(): void {
    this._isAdmin.set(this.authService.isAdmin());
    if( this.isAdmin ) {
      this.menuItems = [
        {
          label: 'Bienvenido',
          routerLink: '/admin',
        },
        {
        label: 'Usuarios',
        routerLink: '/admin/usuarios'
        },
        {
        label: 'Membresias',
        routerLink: '/admin/membresias',
        },
        {
        label: 'Pagos',
        routerLink: '/admin/pagos'
        },
        {
        label: 'Instructores',
        routerLink: '/admin/instructores'
        },
        {
        label: 'Clases',
        routerLink: '/admin/clases'
        },
        {
        label: 'Reservas',
        routerLink: '/admin/reservas'
        },
        {
        label: 'Promociones',
        routerLink: '/admin/promociones'
        },
      ]
    }
  }


}
