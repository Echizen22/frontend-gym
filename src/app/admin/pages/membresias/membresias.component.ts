import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { MembresiaService } from '../../services/membresia.service';
import { Membresia } from '../../interfaces/membresia.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-membresias',
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
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.scss'
})
export class MembresiasComponent implements OnInit {

  // @ViewChild(GenericFormComponent, { static: false }) formRef!: GenericFormComponent<Membresia>;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly membresiaService = inject(MembresiaService);
  private messageService = inject( MessageService );

  membresias!: Membresia[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedMembresia!: Membresia;
  selectIdMembresia!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Membresia>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'precio', header: 'Precio', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'tipo', header: 'Tipo Membresia', dataType: 'text', filterable: true, filterType: 'select', filterOptions: [
        { label: 'Mensual', value: 'mensual' },
        { label: 'Semestral', value: 'semestral' },
        { label: 'Anual', value: 'anual' },
      ]},
      { field: 'duracion', header: 'Duración', dataType: 'number', filterable: true, filterType: 'numeric' },
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadMembresias();
  }


  onCreateMembresia(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedMembresia = {} as Membresia;
    this.titleDialog = 'Crear Membresia';
    this.displayDialog = showModal;
  }

  onEditMembresia(id: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Membresia';
    this.displayDialog = true;
    this.selectIdMembresia = id;

    this.membresiaService.getMembresiaById(id).subscribe({
      next: (membresia: Membresia) => {
        this.selectedMembresia = membresia;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeleteMembresia(id: string) {
    this.membresiaService.deleteMembresia(id).subscribe(this.deleteMembresia());
  }

  updateMembresia(membresia: Membresia) {
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.membresiaService.createMembresia(membresia).subscribe(this.createMembresia());
        break;
      case 'edit':
        this.membresiaService.updateMembresiaById(this.selectIdMembresia, membresia).subscribe(this.editMembresia());
        break;
      default:
        console.warn('Modo desconocido en updateMembresia');
    }
  }

  handleCancel(formRef: GenericFormComponent<Membresia>) {
    formRef.resetForm();
    this.selectedMembresia = {} as Membresia;
    this.displayDialog = false;
  }


  private loadMembresias() {
    this.loading = true;
    this.membresiaService.getAllWithPagination().subscribe(this.getMembresias());
  }

  private getMembresias(): Partial<Observer<Membresia[]>> {
    return  {
      next: (res) => {
        this.membresias = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    }
  }

  private createMembresia(): Partial<Observer<Membresia>> {
    return {
      next: (res: Membresia) => {
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al crear membresia:', error);
      }
    }
  }

  private editMembresia(): Partial<Observer<Membresia>> {
    return {
      next: (res: Membresia) => {
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al actualizar membresia:', error);
      }
    }
  }

  private deleteMembresia(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Membresia eliminada con exito', detail: 'Membresia Eliminada' });
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al eliminar una membresia:', error);
      }
    }
  }

  buildFormFields(mode: 'create' | 'edit'): FormField<Membresia>[] {
    const fields: FormField<Membresia>[] = [
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'precio', label: 'Precio', type: 'number', numberType: 'currency', validators: [Validators.required] },
      {
        name: 'tipo',
        label: 'Tipo Membresia',
        type: 'dropdown',
        clear: true,
        validators: [Validators.required],
        options: [
          { label: 'Mensual', value: 'mensual' },
          { label: 'Semestral', value: 'semestral' },
          { label: 'Anual', value: 'anual' },
        ],
        defaultValue: null
      },
      { name: 'duracion', label: 'Duración', type: 'number', validators: [Validators.required] },
    ];

    return fields;

  }


}
