import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { InstructorService } from '../../services/instructor.service';
import { MessageService } from 'primeng/api';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { Observer } from 'rxjs';
import { Instructor } from '../../interfaces/instructor.interface';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-instructores',
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
    ToastModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './instructores.component.html',
  styleUrl: './instructores.component.scss'
})
export class InstructoresComponent {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly instructorService = inject(InstructorService);
  private messageService = inject( MessageService );

  instructores!: Instructor[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedInstructor!: Instructor;
  selectIdInstructor!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Instructor>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'apellidos', header: 'Apellidos', dataType: 'text', filterable: true, filterType: 'text', responsiveClass: 'table-cell' },
      { field: 'especialidad', header: 'Especialidad', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'experiencia', header: 'Experiencia', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'telefono', header: 'Teléfono', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'foto', header: 'Foto', dataType: 'img', filterable: false, filterType: 'text'},
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };

  ngOnInit(): void {
    this.loadInstructores();
  }


  onCreateInstructor(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedInstructor = {} as Instructor;
    this.titleDialog = 'Crear Membresia';
    this.displayDialog = showModal;
  }

  onEditInstructor(id: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Membresia';
    this.displayDialog = true;
    this.selectIdInstructor = id;

    this.instructorService.getInstructorById(id).subscribe({
      next: (instructor: Instructor) => {
        this.selectedInstructor = instructor;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeleteInstructor(id: string) {
    this.instructorService.deleteInstructor(id).subscribe(this.deleteInstructor());
  }

  updateInstructor(instructor: Instructor) {
    this.displayDialog = false;
    const { file = '', ...rest } = instructor;

    rest.foto = file;

    const nuevoInstructor = {
      ...rest,
      foto: file
    }


    switch (this.mode) {
      case 'create':
        this.instructorService.createInstructor(nuevoInstructor).subscribe(this.createInstructor());
        break;
      case 'edit':
        this.instructorService.updateInstructorById(this.selectIdInstructor, nuevoInstructor).subscribe(this.editInstructor());
        break;
      default:
        console.warn('Modo desconocido en updateInstructor');
    }
  }

  handleCancel(formRef: GenericFormComponent<Instructor>) {
    formRef.resetForm();
    this.selectedInstructor = {} as Instructor;
    this.displayDialog = false;
  }


  private loadInstructores() {
    this.loading = true;
    this.instructorService.getAllWithPagination().subscribe(this.getInstructores());
  }

  private getInstructores(): Partial<Observer<Instructor[]>> {
    return  {
      next: (res) => {
        this.instructores = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    }
  }

  private createInstructor(): Partial<Observer<Instructor>> {
    return {
      next: (res: Instructor) => {
        this.loadInstructores();
      },
      error: (error) => {
        console.error('Error al crear al instructor:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    }
  }

  private editInstructor(): Partial<Observer<Instructor>> {
    return {
      next: (res: Instructor) => {
        this.loadInstructores();
      },
      error: (error) => {
        console.error('Error al actualizar al instructor:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    }
  }

  private deleteInstructor(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Instructor eliminado con exito', detail: 'Instructor Eliminada' });
        this.loadInstructores();
      },
      error: (error) => {
        console.error('Error al eliminar un instructor:', error);
      }
    }
  }

  buildFormFields(mode: 'create' | 'edit'): FormField<Instructor>[] {
    const fields: FormField<Instructor>[] = [
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'apellidos', label: 'Apellidos', type: 'text', validators: [Validators.required] },
      { name: 'especialidad', label: 'Especialidad', type: 'text', validators: [Validators.required] },
      { name: 'experiencia', label: 'Experiencia (Años)', type: 'number', validators: [Validators.required] },
      { name: 'telefono', label: 'Teléfono', type: 'text', validators: [Validators.required] },
      // { name: 'foto', label: 'Foto', type: 'text', validators: [Validators.required] },
      { name: 'file', inputName: 'foto', label: 'Foto', type: 'fileUpload', accept: 'image/*', validators: [Validators.required] }
    ];

    return fields;

  }

}
