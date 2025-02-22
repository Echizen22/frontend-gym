import { Component } from '@angular/core';

import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    DividerModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
