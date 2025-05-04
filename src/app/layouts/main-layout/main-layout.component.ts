import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    CommonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {


  private readonly authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.authStatus().isLoggedIn);
  isAdmin = computed(() => this.authService.authStatus().isAdmin);

  showMenu = computed(() => this.authService.authStatus().isLoggedIn !== null);

  // menuItems!: MenuItem[];
  // itemsSetting!: MenuItem[];

  menuItems = signal<MenuItem[]>([]);
  itemsSetting = signal<MenuItem[]>([]);

  // ngOnInit(): void {
  //   this.menuItems = [
  //     { label: 'Inicio', routerLink: '/' },
  //     { label: 'About', routerLink: '/about' },
  //     { label: 'Contacto', routerLink: '/contacto' }
  //   ];

  //   if( !this.isLoggedIn() ) {
  //     this.menuItems.push({ label: 'Clases', routerLink: '/clases' });
  //   }

  //   if( this.isLoggedIn() && !this.isAdmin() ) {
  //     this.menuItems.push({ label: 'Mis Clases', routerLink: '/user/mis-clases' });
  //     this.itemsSetting = [
  //       {
  //             label: 'Options',
  //             items: [
  //               {
  //                 label: 'Perfil',
  //                 icon: 'pi pi-user',
  //                 routerLink: '/user/mi-perfil'
  //               },
  //               {
  //                   label: 'Logout',
  //                   icon: 'pi pi-sign-out',
  //                   command: () => this.authService.logout()
  //               }
  //             ]
  //           }
  //     ];
  //   }

  //   if( this.isLoggedIn() && this.isAdmin() ) {
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
  //     ];

  //     this.itemsSetting = [
  //       {
  //         label: 'Options',
  //         items: [
  //           {
  //               label: 'Logout',
  //               icon: 'pi pi-sign-out',
  //               command: () => this.authService.logout()
  //           }
  //         ]
  //       }
  //     ];
  //   }

  // }


  constructor() {
    effect(() => {
      const loggedIn = this.isLoggedIn();
      const admin = this.isAdmin();

      this.actualizarMenu(loggedIn, admin);
    }, { allowSignalWrites: true });
  }

  actualizarMenu(loggedIn: boolean, admin: boolean) {

    console.log({loggedIn, admin});
    const items: MenuItem[] = [];
    const settings: MenuItem[] = [];

    if (!loggedIn) {
      items.push(
        { label: 'Inicio', routerLink: '/' },
        { label: 'About', routerLink: '/about' },
        { label: 'Contacto', routerLink: '/contacto' },
        { label: 'Clases', routerLink: '/clases' }
      );
    }

    if (loggedIn && !admin) {

      items.push(
        { label: 'Inicio', routerLink: '/' },
        { label: 'About', routerLink: '/about' },
        { label: 'Contacto', routerLink: '/contacto' },
        { label: 'Mis Clases', routerLink: '/user/mis-clases' }
      );


      settings.push({
        label: 'Options',
        items: [
          { label: 'Perfil', icon: 'pi pi-user', routerLink: '/user/mi-perfil' },
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.authService.logout() }
        ]
      });
    }

    if (loggedIn && admin) {
      items.push(
        { label: 'Bienvenido', routerLink: '/admin' },
        { label: 'Usuarios', routerLink: '/admin/usuarios' },
        { label: 'Membresias', routerLink: '/admin/membresias' },
        { label: 'Pagos', routerLink: '/admin/pagos' },
        { label: 'Instructores', routerLink: '/admin/instructores' },
        { label: 'Clases', routerLink: '/admin/clases' },
        { label: 'Reservas', routerLink: '/admin/reservas' },
        { label: 'Promociones', routerLink: '/admin/promociones' }
      );

      settings.push({
        label: 'Options',
        items: [
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.authService.logout() }
        ]
      });
    }

    this.menuItems.set(items);
    this.itemsSetting.set(settings);
  }


}
