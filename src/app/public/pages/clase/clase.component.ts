import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClasesService } from '../../../services/clases.service';
import { ClaseDetalleCompleto } from '../../../interfaces/clases-con-horario.interface';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'public-clase',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './clase.component.html',
  styleUrl: './clase.component.scss'
})
export class ClaseComponent implements OnInit {


  @ViewChild('imgTitle') imgTitle!: ElementRef<HTMLImageElement>;

  private route = inject(ActivatedRoute);
  private readonly clasesService = inject(ClasesService);
  private cdr = inject(ChangeDetectorRef);

  num = 0;
  claseId!: string;
  clase!: ClaseDetalleCompleto;
  loading = true;
  error = signal<string | null>(null);
 containerBg!: any;
 imgBg: string = '';

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.loadClase(id);
    });

  }

  private loadClase(id: string) {
    this.clasesService.getClaseConHorarios(id).subscribe({
      next: (res) => {


        setTimeout(() => {

          this.imgBg = '';
          if ( res.instructor.nombre.toLowerCase() === 'carlos' ) {
            this.imgBg = 'https://i.blogs.es/1e201b/1366_2000-60-/1366_2000.jpeg';
            console.log(this.imgBg);
          }



          this.clase = res;
          this.loading = false;
        }, 200);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


}
