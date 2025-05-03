import { Component } from '@angular/core';
import { ClasesListComponent } from '../../../shared/components/clases-list/clases-list.component';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [
    ClasesListComponent
  ],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent {

}
