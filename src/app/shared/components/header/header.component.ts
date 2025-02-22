import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    CommonModule,

    MenubarModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input()
  menuItems!: MenuItem[];

}
