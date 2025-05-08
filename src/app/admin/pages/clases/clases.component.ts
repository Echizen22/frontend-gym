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
import { FormField, OptionsDropDown } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { firstValueFrom, Observer } from 'rxjs';
import { InstructorService } from '../../services/instructor.service';
import { ToastModule } from 'primeng/toast';
import { Horario } from '../../interfaces/horario.interface';

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
    ToastModule
  ],
  providers: [
    MessageService,
    InstructorService,
    ClaseService,
  ],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly claseService = inject(ClaseService);
  private readonly instructorService = inject(InstructorService);
  private messageService = inject( MessageService );

  clases!: Clase[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedClase!: Clase;
  selectedHorario!: Horario;
  selectIdClase!: string;
  selectIdHorario!: string;
  titleDialog!: string;
  titleDialogExpansion!: string;
  displayDialogExpansion!: boolean;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Clase>[];
  formFieldsExpansion!: FormField<Horario>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'descripcion', header: 'Descripción', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'duracion', header: 'Duración', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'capacidadMax', header: 'Capacidad Máxima', dataType: 'number', filterable: true, filterType: 'numeric' },
      { field: 'instructorNombre', header: 'Instructor', dataType: 'text', filterable: false, filterType: 'select', filterOptions: []},
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: true,
    dataKey: 'id',
    expansionConfig: {
      dataField: 'horarios',
      title: 'Horarios de clase',
      columns: [
        { field: 'horaIni', header: 'Hora Inicio', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
        { field: 'horaFin', header: 'Hora Fin', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
        { field: 'fecha', header: 'Fecha', object: true, sortable: true, dataType: 'date', filterable: true, filterType: 'date' },
        { field: 'plazasOcupadas', header: 'Plazas Ocupadas', dataType: 'number', sortable: true, filterable: false, filterType: 'numeric' }
      ]
    }
  };

  ngOnInit(): void {
    this.loadClases();
    this.loadInstructoresDropdownForTable();
  }

  async onCreateClase(showModal: boolean) {
    this.mode = 'create';
    this.formFields = await this.buildFormFields(this.mode);
    this.selectedClase = {} as Clase;
    this.titleDialog = 'Crear Clase';
    this.displayDialog = showModal;
  }

  async onEditClase(id: string) {
    this.mode = 'edit';
    this.titleDialog = 'Editar Clase';
    this.selectIdClase = id;

    // Primero obtenemos los datos de la clase
    this.claseService.getClaseById(id).subscribe({
      next: (clase: Clase) => {

        // if (!clase.instructor) {
        //   console.error('Instructor no definido en la clase');
        //   return;
        // }

        this.selectedClase = {
          ...clase,
          idInstructor: clase.instructor.id
        };

        this.buildFormFields(this.mode).then( formFields => {
          this.formFields = formFields;
          this.displayDialog = true;
        })

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
      // Prepara los datos para la API
      const dataParaAPI = {
        ...clase,
        idInstructor: clase.idInstructor
      };

    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.claseService.createClase(dataParaAPI).subscribe(this.createClase());
        break;
      case 'edit':
        this.claseService.updateClaseById(this.selectIdClase, dataParaAPI).subscribe(this.editClase());
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
        this.clases = res.map(clase => ({
          ...clase,
          instructorNombre: `${clase.instructor.nombre} ${clase.instructor.apellidos}`
        }));
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

  async buildFormFields(mode: 'create' | 'edit'): Promise<FormField<Clase>[]> {
    const fields: FormField<Clase>[] = [
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', validators: [Validators.required] },
      { name: 'duracion', label: 'Duración', type: 'number', validators: [Validators.required] },
      { name: 'capacidadMax', label: 'Capacidad Máxima', type: 'number', validators: [Validators.required] },
    ];

    try {
      const instructores = await firstValueFrom(this.instructorService.getInstructoresForDropdown());

      const instructorField: FormField<Clase> = {
        name: 'idInstructor',
        label: 'Instructor',
        type: 'dropdown',
        clear: false,
        validators: [Validators.required],
        options: instructores,
        defaultValue: null
      };

      if (mode === 'edit' && this.selectedClase?.idInstructor) {
        instructorField.defaultValue = this.selectedClase.idInstructor;
      }

      fields.push(instructorField);

    } catch (error) {
      console.error('Error al cargar instructores para dropdown:', error);

      fields.push({
        name: 'instructor',
        label: 'Instructor (no disponible)',
        type: 'dropdown',
        clear: false,
        validators: [],
        options: [],
        defaultValue: null
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los instructores'
      });

    }

    return fields;

  }


  private async loadInstructoresDropdownForTable() {
    try {
      const instructores = await firstValueFrom(this.instructorService.getInstructoresForDropdown());

      // Buscamos la columna de idInstructor
      const instructorColumn = this.tableConfig.columns.find(col => col.field === 'instructor');

      if (instructorColumn) {
        instructorColumn.filterOptions = instructores;
      }

    } catch (error) {
      console.error('Error al cargar instructores para el filtro de tabla:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los instructores para el filtro'
      });
    }
  }


  // Expansion
  async onCreateHorario(showModalExpansion: { id: string; showModal: boolean; }) {
    this.mode = 'create';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, showModalExpansion.id);
    this.selectedHorario = {} as Horario;
    this.titleDialogExpansion = 'Añadir horario a la clase';
    this.displayDialogExpansion = showModalExpansion.showModal;
  }

  async onEditHorario(ids: { id: string; idPadre: string; }) {
    this.mode = 'edit';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, ids.idPadre);
    this.titleDialogExpansion = 'Editar horario de la clase';
    this.displayDialogExpansion = true;
    this.selectIdHorario = ids.id;

    this.claseService.getHorarioById(ids.id).subscribe({
      next: (respuesta) => {

        this.selectedHorario = {
          ...respuesta,
          fecha: new Date(respuesta.fecha)
        };

        // if( respuesta.promocion ) {
        //     this.selectedMembresiaPromocion = {
        //       ...respuesta,
        //       idMembresia: ids.idPadre,
        //       idPromocion: respuesta.promocion.id
        //     };

        // }

      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  onDeleteHorario(id: string) {
    this.claseService.deleteHorario(id).subscribe(this.deleteHorario());
  }

  private deleteHorario(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Horario eliminada con exito', detail: 'Horario Eliminada' });
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al eliminar un horario:', error);
      }
    }
  }

  updateHorario(horario: Horario) {
    this.displayDialogExpansion = false;

    switch (this.mode) {
      case 'create':
        this.claseService.createHorario(horario).subscribe(this.createHorario());
        break;
      case 'edit':
        this.claseService.updateHorarioById(this.selectIdHorario, horario).subscribe(this.editHorario());
        break;
      default:
        console.warn('Modo desconocido en horario');
    }
  }

  private createHorario(): Partial<Observer<Horario>> {
    return {
      next: (res: Horario) => {
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al crear horario:', error);
      }
    }
  }

  private editHorario(): Partial<Observer<Horario>> {
    return {
      next: (res: Horario) => {
        this.loadClases();
      },
      error: (error) => {
        console.error('Error al actualizar horario:', error);
      }
    }
  }

  handleExpansionCancel(formRef: GenericFormComponent<Horario>) {
    formRef.resetForm();
    this.selectedHorario = {} as Horario;
    this.displayDialogExpansion = false;
  }

  async buildFormFieldsExpansion(mode: 'create' | 'edit', id: string ): Promise<FormField<Horario>[]> {
    const fields: FormField<Horario>[] = [
      { name: 'horaIni', label: 'Hora Inicio', type: 'time', validators: [Validators.required] },
      { name: 'horaFin', label: 'Hora Fin', type: 'time', validators: [Validators.required] },
      { name: 'fecha', label: 'Fecha', type: 'date', validators: [Validators.required] },
    ];


    try {
      const clasesDropdown = await firstValueFrom(this.claseService.getClasesForDropdown());

      const claseField: FormField<Horario> = {
        name: 'idClase',
        label: 'Clase',
        readonly: true,
        type: 'dropdown',
        options: clasesDropdown,
        defaultValue: id
      };

      fields.push(claseField);

    } catch (error) {
      console.error('Error al cargar membresia o promociones para dropdown:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las clases.'
      });
    }
    return fields;
  }
}
