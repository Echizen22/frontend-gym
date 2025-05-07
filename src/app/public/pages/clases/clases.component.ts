import { Component, inject, OnInit } from '@angular/core';
import { ClasesListComponent } from '../../../shared/components/clases-list/clases-list.component';
import { ClasesService } from '../../../services/clases.service';
import { ClaseDetalleCompleto } from '../../../interfaces/clases-con-horario.interface';

@Component({
  selector: 'public-clases',
  standalone: true,
  imports: [
    ClasesListComponent
  ],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent implements OnInit {


  private readonly clasesService = inject(ClasesService);

  clases!: ClaseDetalleCompleto[];


  ngOnInit(): void {

    this.clasesService.getClasesConHorarios().subscribe({
      next: (res) => {
        this.clases = res;
      },
      error: (err) => {
        console.error(err.error);
      }
    });


  }






}
