import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClasesService } from '../../../services/clases.service';
import { ClaseDetalleCompleto, Horario } from '../../../interfaces/clases-con-horario.interface';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { ReservaService } from '../../../admin/services/reserva.service';
import { EstadoHorario, Reserva, ReservaPorHorario } from '../../../admin/interfaces/reserva.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';



@Component({
  selector: 'public-clase',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './clase.component.html',
  styleUrl: './clase.component.scss'
})
export class ClaseComponent implements OnInit {


  private route = inject(ActivatedRoute);
  private readonly clasesService = inject(ClasesService);
  private readonly authService = inject(AuthService);
  private readonly reservaService = inject(ReservaService);
  private readonly messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  horarioSeleccionado!: Horario;
  horarioSelect!: string;

  isLogin!: boolean;

  num = 0;
  claseId!: string;
  clase!: ClaseDetalleCompleto;
  loading = true;
  error = signal<string | null>(null);
  containerBg!: any;
  imgBg: string = '';
  reservaRealizada = false;
  newReserva!: Reserva;
  reservaExistente?: Reserva;

  ngOnInit(): void {

    this.isLogin = this.authService.isLoggedIn();

    this.route.paramMap.subscribe(params => {
      const id = decodeURIComponent(params.get('id')?.trim() ?? '');
      if (!id) return;
      this.loadClase(id);
    });

  }

  private loadClase(id: string) {
    this.clasesService.getClaseConHorarios(id).subscribe({
      next: (res) => {
        this.clase = res;
        this.loading = false;

        // setTimeout(() => {

        //   this.imgBg = '';
        //   const instructorNombre = res.instructor.nombre.toLowerCase();
        //   if ( instructorNombre === 'carlos' || instructorNombre === 'diego' ) {
        //     this.imgBg = 'https://i.blogs.es/1e201b/1366_2000-60-/1366_2000.jpeg';
        //     console.log(this.imgBg);
        //   }

        //   if( instructorNombre === 'maría') {
        //     this.imgBg = 'https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
        //   }




        //   this.clase = res;
        //   this.loading = false;
        // }, 200);

        // Si está logeado, buscamos la reserva confirmada del usuario
        if (this.isLogin) {
          const dni = this.authService.getCurrentUser().dni;
          this.reservaService.getReservaConfirmada(dni, id).subscribe({
            next: (reserva) => {
              if (reserva) {
                this.reservaExistente = reserva;
                const horarioReservado = this.clase.horarios.find(h => h.id === reserva.horario!.id);
                if (horarioReservado) {
                  this.seleccionarHorario(horarioReservado);
                }
              }
            },
            error: (err) => console.error('Error buscando reserva confirmada', err)
          });

        }


      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  reservarClase() {

    if (!this.isLogin) {
      this.messageService.add({
        severity: 'info',
        summary: 'Atención',
        detail: 'Debes iniciar sesión para poder reservar una clase.'
      });
      return;
    }

    this.newReserva.estado = EstadoHorario.Confirmada;
    this.reservaService.createReserva(this.newReserva).subscribe({
      next: (res) => {
        this.reservaRealizada = true;

        // Reseteamos la selección del horario
        this.horarioSeleccionado = {} as Horario;
        this.newReserva = {} as Reserva;

        // Puedes actualizar plazas ocupadas o recargar la clase
        this.loadClase(this.clase.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Reserva exitosa',
          detail: 'Tu clase ha sido reservada con éxito.'
        });


      },
      error: (error) => {
        console.error('Error al crear reserva:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
      }
    });

  }

  seleccionarHorario(horario: Horario) {
    if (this.horarioSeleccionado?.id === horario.id) {
      // Si ya está seleccionado, lo deseleccionamos
      this.horarioSeleccionado = undefined!;
      this.newReserva = {} as Reserva;
    } else {
      // Si es nuevo, lo seleccionamos
      this.horarioSeleccionado = horario;
      this.newReserva = {
        idUsuario: this.authService.getCurrentUser().dni,
        idHorario: horario.id,
        fecha: new Date(),
        estado: EstadoHorario.Pendiente
      };

    }

  }

  cancelarReserva() {
    if (!this.reservaExistente) return;

    if( this.reservaExistente.id) {
      this.reservaService.deleteReserva(this.reservaExistente.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reserva cancelada',
            detail: 'Tu reserva ha sido cancelada exitosamente.'
          });

          this.reservaExistente = undefined;
          this.horarioSeleccionado = undefined!;
          this.newReserva = {} as Reserva;

          this.loadClase(this.clase.id);
        },
        error: (err) => {
          console.error('Error al cancelar reserva:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cancelar la reserva.'
          });
        }
      });

    }



  }


}
