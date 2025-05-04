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

  iconClass = signal('pi pi-bars');

  constructor() {
    this.updateIcon(window.innerWidth);
    window.addEventListener('resize', () => {
      this.updateIcon(window.innerWidth);
    });
  }

  updateIcon(width: number) {
    this.iconClass.set(width < 550 ? 'pi pi-ellipsis-v' : 'pi pi-bars');
  }

}
