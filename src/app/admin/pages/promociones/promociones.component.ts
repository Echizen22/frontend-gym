import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { PromocionService } from '../../services/promocion.service';
import { Promocion } from '../../interfaces/promocion.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-promociones',
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
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.scss'
})
export class PromocionesComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly promocionService = inject(PromocionService);
  private messageService = inject( MessageService );

  promociones!: Promocion[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedPromocion!: Promocion;
  selectIdPromocion!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Promocion>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'descripcion', header: 'Descripción', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'descuento', header: 'Descuento', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'fechaIni', header: 'Fecha Inicio', dataType: 'date', filterable: true, filterType: 'date' },
      { field: 'fechaFin', header: 'Fecha Fin', dataType: 'date', filterable: true, filterType: 'date' }
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadPromociones();
  }

  onCreatePromocion(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedPromocion = {} as Promocion;
    this.titleDialog = 'Crear Promoción';
    this.displayDialog = showModal;
  }

  onEditPromocion(id: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Promoción';
    this.displayDialog = true;
    this.selectIdPromocion = id;

    this.promocionService.getPromocionById(id).subscribe({
      next: (promocion: Promocion) => {
        const { fechaIni, fechaFin, ...rest } = promocion;

        this.selectedPromocion = {
          fechaIni: new Date(fechaIni),
          fechaFin: new Date(fechaFin),
          ...rest
        };
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeletePromocion(id: string) {
    this.promocionService.deletePromocion(id).subscribe(this.deletePromocion());
  }

  updatePromocion(promocion: Promocion) {
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.promocionService.createPromocion(promocion).subscribe(this.createPromocion());
        break;
      case 'edit':
        this.promocionService.updatePromocionById(this.selectIdPromocion, promocion).subscribe(this.editPromocion());
        break;
      default:
        console.warn('Modo desconocido en updatePromocion');
    }
  }

  handleCancel(formRef: GenericFormComponent<Promocion>) {
    formRef.resetForm();
    this.selectedPromocion = {} as Promocion;
    this.displayDialog = false;
  }

  private loadPromociones() {
    this.loading = true;
    this.promocionService.getAllWithPagination().subscribe(this.getPromociones());
  }

  private getPromociones(): Partial<Observer<Promocion[]>> {
    return  {
      next: (res) => {
        this.promociones = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    }
  }

  private createPromocion(): Partial<Observer<Promocion>> {
    return {
      next: (res: Promocion) => {
        this.loadPromociones();
      },
      error: (error) => {
        console.error('Error al crear promoción:', error);
      }
    }
  }

  private editPromocion(): Partial<Observer<Promocion>> {
    return {
      next: (res: Promocion) => {
        this.loadPromociones();
      },
      error: (error) => {
        console.error('Error al actualizar promoción:', error);
      }
    }
  }

  private deletePromocion(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Promoción eliminada con exito', detail: 'Promoción Eliminada' });
        this.loadPromociones();
      },
      error: (error) => {
        console.error('Error al eliminar una promoción:', error);
      }
    }
  }

  buildFormFields(mode: 'create' | 'edit'): FormField<Promocion>[] {
    const fields: FormField<Promocion>[] = [
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required, Validators.maxLength(100) ] },
      { name: 'descripcion', label: 'Descripción', type: 'text', validators: [Validators.required] },
      { name: 'descuento', label: 'Descuento', type: 'number', numberType: 'decimal', validators: [Validators.required] },
      { name: 'fechaIni', label: 'Fecha Inicio', type: 'date', validators: [ Validators.required ]},
      { name: 'fechaFin', label: 'Fecha Fin', type: 'date', validators: [ Validators.required ]},

    ];

    return fields;

  }

}
