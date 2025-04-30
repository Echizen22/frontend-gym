import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../interfaces/reserva.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    GenericFormComponent,
    GenericTableComponent,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    GenericFormComponent,
    DialogModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly reservaService = inject(ReservaService);
  private messageService = inject( MessageService );

  reservas!: Reserva[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedReserva!: Reserva;
  selectIdReserva!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';


  // Campo para el formulario generico
  formFields!: FormField<Reserva>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'usuario.dni', header: 'Dni', dataType: 'text', object: true, filterable: true, filterType: 'text' },
      { field: 'usuario.nombre', header: 'Nombre', dataType: 'text', object: true, filterable: true, filterType: 'text' },
      { field: 'usuario.apellidos', header: 'Apellidos', dataType: 'text', object: true, filterable: true, filterType: 'text' },
      { field: 'estado', header: 'Estado', dataType: 'text', filterable: true, filterType: 'select', selectBg: false, filterOptions: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Confirmada', value: 'confirmada' },
        { label: 'Cancelada', value: 'cancelada' },
      ]},
      { field: 'fecha', header: 'Fecha', dataType: 'date', filterable: true, filterType: 'date' },
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadReservas();
  }

  onCreateReserva(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedReserva = {} as Reserva;
    this.titleDialog = 'Crear Reserva';
    this.displayDialog = showModal;
  }

  onEditReserva(id: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Reserva';
    this.displayDialog = true;
    this.selectIdReserva = id;

    this.reservaService.getReservaById(id).subscribe({
      next: (reserva: Reserva) => {

        const { fecha, ...rest } = reserva;

        this.selectedReserva = {
          fecha: new Date(fecha),
          ...rest
        };
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeleteReserva(id: string) {
    this.reservaService.deleteReserva(id).subscribe(this.deleteReserva());
  }

  updateReserva(reserva: Reserva) {
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.reservaService.createReserva(reserva).subscribe(this.createReserva());
        break;
      case 'edit':
        this.reservaService.updateReservaById(this.selectIdReserva, reserva).subscribe(this.editReserva());
        break;
      default:
        console.warn('Modo desconocido en updateReserva');
    }
  }

  handleCancel(formRef: GenericFormComponent<Reserva>) {
    formRef.resetForm();
    this.selectedReserva = {} as Reserva;
    this.displayDialog = false;
  }

  private loadReservas() {
    this.loading = true;
    this.reservaService.getAllWithPagination().subscribe(this.getReservas());
  }

  private getReservas(): Partial<Observer<Reserva[]>> {
    return  {
      next: (res) => {
        this.reservas = res.map( reserva => {
          reserva.fecha = new Date(reserva.fecha);
          return reserva;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    }
  }

  private createReserva(): Partial<Observer<Reserva>> {
    return {
      next: (res: Reserva) => {
        this.loadReservas();
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
      }
    }
  }

  private editReserva(): Partial<Observer<Reserva>> {
    return {
      next: (res: Reserva) => {
        this.loadReservas();
      },
      error: (error) => {
        console.error('Error al actualizar reserva:', error);
      }
    }
  }

  private deleteReserva(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Reserva eliminada con exito', detail: 'Reserva Eliminada' });
        this.loadReservas();
      },
      error: (error) => {
        console.error('Error al eliminar una reserva:', error);
      }
    }
  }

  buildFormFields(mode: 'create' | 'edit'): FormField<Reserva>[] {
    const fields: FormField<Reserva>[] = [
      {
        name: 'estado',
        label: 'Estado',
        type: 'dropdown',
        clear: true,
        validators: [Validators.required],
        options: [
          { label: 'Pendiente', value: 'pendiente' },
          { label: 'Confirmada', value: 'confirmada' },
          { label: 'Cancelada', value: 'cancelada' },
        ],
        defaultValue: null
      },
      { name: 'fecha', label: 'Fecha', type: 'date', validators: [Validators.required] },
    ];

    fields.unshift(
      {
        name: 'idUsuario',
        label: 'Usuario',
        type: 'autocomplete',
        clear: true,
        validators: [Validators.required],
        options: [
        ],
        defaultValue: null
      }
    );

    fields.push({
      name: 'idClase',
      label: 'Clase',
      type: 'dropdown',
      clear: true,
      validators: [Validators.required],
      options: [
      ],
      defaultValue: null
    });

    return fields;

  }


}
