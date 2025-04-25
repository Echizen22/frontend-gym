import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ClaseService } from '../../services/clase.service';
import { Clase } from '../../interfaces/clase.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-clases',
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
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly claseService = inject(ClaseService);
  private messageService = inject( MessageService );

  clases!: Clase[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedClase!: Clase;
  selectIdClase!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Clase>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'descripcion', header: 'Descripción', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'duracion', header: 'Duración', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'capacidadMax', header: 'Capacidad Máxima', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'idInstructor', header: 'Instructor', dataType: 'text', filterable: true, filterType: 'select', filterOptions: [
      ]},
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadClases();
  }

  onCreateClase(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedClase = {} as Clase;
    this.titleDialog = 'Crear Clase';
    this.displayDialog = showModal;
  }

  onEditClase(id: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Clase';
    this.displayDialog = true;
    this.selectIdClase = id;

    this.claseService.getClaseById(id).subscribe({
      next: (clase: Clase) => {
        this.selectedClase = clase;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeleteClase(id: string) {
    this.claseService.deleteClase(id).subscribe(this.deleteClase());
  }

  updateClase(clase: Clase) {
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.claseService.createClase(clase).subscribe(this.createClase());
        break;
      case 'edit':
        this.claseService.updateClaseById(this.selectIdClase, clase).subscribe(this.editClase());
        break;
      default:
        console.warn('Modo desconocido en updateClase');
    }
  }

  handleCancel(formRef: GenericFormComponent<Clase>) {
    formRef.resetForm();
    this.selectedClase = {} as Clase;
    this.displayDialog = false;
  }


  private loadClases() {
    this.loading = true;
    this.claseService.getAllWithPagination().subscribe(this.getClases());
  }

  private getClases(): Partial<Observer<Clase[]>> {
    return  {
      next: (res) => {
        this.clases = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    }
  }

  private createClase(): Partial<Observer<Clase>> {
    return {
      next: (res: Clase) => {
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al crear la clase:', error);
      }
    }
  }

  private editClase(): Partial<Observer<Clase>> {
    return {
      next: (res: Clase) => {
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al actualizar la clase:', error);
      }
    }
  }

  private deleteClase(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Clase eliminada con exito', detail: 'Clase Eliminada' });
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al eliminar una clase:', error);
      }
    }
  }

  buildFormFields(mode: 'create' | 'edit'): FormField<Clase>[] {
    const fields: FormField<Clase>[] = [
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'descripcion', label: 'Descripción', type: 'text', validators: [Validators.required] },
      { name: 'duracion', label: 'Duración', type: 'number', validators: [Validators.required] },
      { name: 'capacidadMax', label: 'Capacidad Máxima', type: 'number', validators: [Validators.required] },
    ];

    fields.push(
      {
        name: 'idInstructor',
        label: 'Instructor',
        type: 'dropdown',
        clear: true,
        validators: [Validators.required],
        options: [
        ],
      },
    )

    return fields;

  }

}
