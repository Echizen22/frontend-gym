import { Component, inject } from '@angular/core';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { MembresiaService } from '../../services/membresia.service';
import { Membresia } from '../../interfaces/membresia.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

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
export class MembresiasComponent {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly usuarioService = inject(MembresiaService);
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
      { field: 'precio', header: 'Precio', dataType: 'number', filterable: true, filterType: 'number' },
      { field: 'tipo', header: 'Tipo Membresia', dataType: 'text', filterable: true, filterType: 'select', filterOptions: [
        { label: 'Mensual', value: 'mensual' },
        { label: 'Semestral', value: 'semestral' },
        { label: 'Anual', value: 'anual' },
      ]},
      { field: 'duracion', header: 'Duración', dataType: 'number', filterable: true, filterType: 'number' },
    ],
    menuMode: 'row',
    showBtnLimpiarFiltros: false,
    showRowExpansion: false
  };


  onCreateMembresia(showModal: boolean) {

  }

  onEditMembresia(id: string) {

  }

  onDeleteMembresia(id: string) {

  }

  updateMembresia(membresia: Membresia) {

  }

  handleCancel(formRef: GenericFormComponent<Membresia>) {

  }


}
