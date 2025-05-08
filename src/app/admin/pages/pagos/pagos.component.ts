import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { MessageService } from 'primeng/api';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../interfaces/pago.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { firstValueFrom, Observer } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-pagos',
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
    MessageService,
    PagoService,
    UsuarioService,
  ],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss'
})
export class PagosComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly pagoService = inject(PagoService);
  private readonly usuarioService = inject(UsuarioService);
  private messageService = inject( MessageService );

  pagos!: Pago[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedPago!: Pago;
  selectIdPago!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Pago>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      // { field: 'idUsuarioMembresia', header: 'Usuario con membresia', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'monto', header: 'Monto', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'fechaPago', header: 'Fecha de Pago', dataType: 'date', filterable: true, filterType: 'date' },
      { field: 'estado', header: 'Estado', dataType: 'text', filterable: true, filterType: 'select', selectBg: false, filterOptions: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Aprobado', value: 'aprobado' },
        { label: 'Rechazado', value: 'rechazado' },
      ]},
      { field: 'duracion', header: 'Duración', dataType: 'number', filterable: true, filterType: 'numeric' },
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadPagos();
  }

  async onCreatePago(showModal: boolean) {
    this.mode = 'create';
    this.formFields = await this.buildFormFields(this.mode);
    this.selectedPago = {} as Pago;
    this.titleDialog = 'Crear Pago';
    this.displayDialog = showModal;
  }

  async onEditPago(id: string) {
    this.mode = 'edit';
    this.formFields = await this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Pago';
    this.displayDialog = true;
    this.selectIdPago = id;

    this.pagoService.getPagoById(id).subscribe({
      next: (pago: Pago) => {

        if( pago.usuarioMembresia ) {
          this.selectedPago = {
            ...pago,
            idUsuarioMembresia: pago.usuarioMembresia.id ?? ''
          };
        }

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeletePago(id: string) {
    this.pagoService.deletePago(id).subscribe(this.deletePago());
  }

  updatePago(pago: Pago) {
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.pagoService.createPago(pago).subscribe(this.createPago());
        break;
      case 'edit':
        this.pagoService.updatePagoById(this.selectIdPago, pago).subscribe(this.editPago());
        break;
      default:
        console.warn('Modo desconocido en updatePago');
    }
  }

  handleCancel(formRef: GenericFormComponent<Pago>) {
    formRef.resetForm();
    this.selectedPago = {} as Pago;
    this.displayDialog = false;
  }

  private loadPagos() {
      this.loading = true;
      this.pagoService.getAllWithPagination().subscribe(this.getPagos());
    }

    private getPagos(): Partial<Observer<Pago[]>> {
      return  {
        next: (res) => {
          this.pagos = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
        }
      }
    }

    private createPago(): Partial<Observer<Pago>> {
      return {
        next: (res: Pago) => {
          this.loadPagos();
        },
        error: (error) => {
          console.error('Error al crear el pago:', error);
        }
      }
    }

    private editPago(): Partial<Observer<Pago>> {
      return {
        next: (res: Pago) => {
          this.loadPagos();
        },
        error: (error) => {
          console.error('Error al actualizar el pago:', error);
        }
      }
    }

    private deletePago(): Partial<Observer<void>> {
      return {
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Pago eliminada con exito', detail: 'Pago Eliminado' });
          this.loadPagos();
        },
        error: (error) => {
          console.error('Error al eliminar el pago:', error);
        }
      }
    }

    async buildFormFields(mode: 'create' | 'edit'): Promise<FormField<Pago>[]> {
      const fields: FormField<Pago>[] = [
        { name: 'monto', label: 'Monto', type: 'number', numberType: 'decimal', validators: [Validators.required] },
        // { name: 'fechaPago', label: 'Fecha de Pago', type: 'date', validators: [Validators.required] },
        { name: 'metodoPago', label: 'Metodo de Pago', type: 'text', validators: [Validators.required] },
        {
          name: 'estado',
          label: 'Estado',
          type: 'dropdown',
          clear: true,
          validators: [Validators.required],
          options: [
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'Aprobado', value: 'aprobado' },
            { label: 'Rechazado', value: 'rechazado' },
          ],
          defaultValue: null
        },
      ];

      try {
        const usuarioMembresiaDropdown = await firstValueFrom(this.usuarioService.getUsuarioMembresiaForDropdown());

        const usuarioMembresiaField: FormField<Pago> = {
          name: 'idUsuarioMembresia',
          label: 'Usuario Membresia',
          type: 'dropdown',
          validators: [Validators.required],
          options: usuarioMembresiaDropdown,
          defaultValue: null
        };

        fields.unshift(usuarioMembresiaField);

      } catch (error) {
        console.error('Error al cargar usuario-membresia:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios-membresias.'
        });
      }

      return fields;

    }


}
