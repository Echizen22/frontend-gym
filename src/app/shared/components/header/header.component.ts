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
export class HeaderComponent {

  @Input()
  menuItems!: MenuItem[];

  @Input()
  isAdmin!: boolean;

  @Input()
  isLoggedIn!: boolean;

  @Input()
  itemsSetting!: MenuItem[];


  // private readonly authService: AuthService = inject(AuthService);

  // isLoggedIn = computed(() => this.authService.authStatus().isLoggedIn);
  // isAdmin = computed(() => this.authService.authStatus().isAdmin);

  // itemsLogin: MenuItem[] = [
  //   {
  //     label: 'Options',
  //     items: [
  //       {
  //         label: 'Perfil',
  //         icon: 'pi pi-user',
  //         routerLink: '/user/mi-perfil'
  //       },
  //       {
  //           label: 'Logout',
  //           icon: 'pi pi-sign-out',
  //           command: () => this.authService.logout()
  //       }
  //     ]
  //   }
  // ];

  // itemsLoginAdmin: MenuItem[] = [
  //   {
  //     label: 'Options',
  //     items: [
  //       {
  //           label: 'Logout',
  //           icon: 'pi pi-sign-out',
  //           command: () => this.authService.logout()
  //       }
  //     ]
  //   }
  // ];






  // ngOnInit(): void {
  //   console.log('header:' + this.isAdmin());
  //   this.isAdminShow = this.isAdmin();
  //   if( this.isAdmin() ) {
  //     this.menuItems = [
  //       {
  //         label: 'Bienvenido',
  //         routerLink: '/admin',
  //       },
  //       {
  //       label: 'Usuarios',
  //       routerLink: '/admin/usuarios'
  //       },
  //       {
  //       label: 'Membresias',
  //       routerLink: '/admin/membresias',
  //       },
  //       {
  //       label: 'Pagos',
  //       routerLink: '/admin/pagos'
  //       },
  //       {
  //       label: 'Instructores',
  //       routerLink: '/admin/instructores'
  //       },
  //       {
  //       label: 'Clases',
  //       routerLink: '/admin/clases'
  //       },
  //       {
  //       label: 'Reservas',
  //       routerLink: '/admin/reservas'
  //       },
  //       {
  //       label: 'Promociones',
  //       routerLink: '/admin/promociones'
  //       },
  //     ]
  //   }
  // }


}
