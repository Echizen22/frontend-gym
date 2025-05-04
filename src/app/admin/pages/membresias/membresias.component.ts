import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { MembresiaService } from '../../services/membresia.service';
import { Membresia, MembresiaPromocion } from '../../interfaces/membresia.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom, Observer } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { PromocionService } from '../../services/promocion.service';

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
    ToastModule,
  ],
  providers: [
    MessageService,
    MembresiaService,
    PromocionService
  ],
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.scss'
})
export class MembresiasComponent implements OnInit {



  // @ViewChild(GenericFormComponent, { static: false }) formRef!: GenericFormComponent<Membresia>;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly membresiaService = inject(MembresiaService);
  private readonly promocionService = inject(PromocionService);
  private messageService = inject( MessageService );

  membresias!: Membresia[];
  loading: boolean = false;
  displayDialog = false;
  totalRecords: number = 0;
  selectedMembresia!: Membresia;
  selectedMembresiaPromocion!: MembresiaPromocion;
  selectIdMembresia!: string;
  selectIdMembresiaPromocion!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';



  // Campo para el formulario generico
  formFields!: FormField<Membresia>[];

  // Configuración de tabla
  tableConfig: TableConfig = {
    columns: [
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'descripciion', header: 'Descripción', dataType: 'text', filterable: true, filterType: 'text', responsiveClass: 'table-cell' },
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
    showRowExpansion: true,
    dataKey: 'id',
    expansionConfig: {
      dataField: 'membresiaPromociones',
      title: 'Promoción de la membresia',
      columns: [
        { field: 'promocion.nombre', header: 'Promoción', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
        { field: 'promocion.descripcion', header: 'Descripción', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
      ]
    }
  };
  titleDialogExpansion!: string;
  displayDialogExpansion!: boolean;
  formFieldsExpansion!: FormField<MembresiaPromocion>[];

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
      { name: 'descripcion', label: 'Descripción', type: 'textarea', validators: [Validators.required] },
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

  // Expansion
  async onCreateMembresiaPromocion(showModalExpansion: { id: string; showModal: boolean; }) {
    this.mode = 'create';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, showModalExpansion.id);
    this.selectedMembresiaPromocion = {} as MembresiaPromocion;
    this.titleDialogExpansion = 'Añadir promoción a la membresia';
    this.displayDialogExpansion = showModalExpansion.showModal;
  }
  async onEditMembresiaPromocion(ids: { id: string; idPadre: string; }) {
    this.mode = 'edit';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, ids.idPadre);
    this.titleDialogExpansion = 'Editar Membresia con Promoción';
    this.displayDialogExpansion = true;
    this.selectIdMembresiaPromocion = ids.id;

    this.membresiaService.getMembresiaPromocionById(ids.id).subscribe({
      next: (respuesta) => {

        if( respuesta.promocion ) {
            this.selectedMembresiaPromocion = {
              ...respuesta,
              idMembresia: ids.idPadre,
              idPromocion: respuesta.promocion.id
            };

        }

      },
      error: (error) => {
        console.error(error);
      }
    });

  }
  onDeleteMembresiaPromocion(id: string) {
    this.membresiaService.deleteMembresiaPromocion(id).subscribe(this.deleteMembresiaPromocion());
  }
  updateMembresiaPromocion(membresiaPromocion: MembresiaPromocion) {
    this.displayDialogExpansion = false;

    switch (this.mode) {
      case 'create':
        this.membresiaService.createMembresiaPromocion(membresiaPromocion).subscribe(this.createMembresiaPromocion());
        break;
      case 'edit':
        this.membresiaService.updateMembresiaPromocionById(this.selectIdMembresiaPromocion, membresiaPromocion).subscribe(this.editMembresiaPromocion());
        break;
      default:
        console.warn('Modo desconocido en updateUser-membresia');
    }
  }

  handleExpansionCancel(formRef: GenericFormComponent<MembresiaPromocion>) {
    formRef.resetForm();
    this.selectedMembresiaPromocion = {} as MembresiaPromocion;
    this.displayDialogExpansion = false;
  }

  private createMembresiaPromocion(): Partial<Observer<MembresiaPromocion>> {
    return {
      next: (res: MembresiaPromocion) => {
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al crear membresia-promocion:', error);
      }
    }
  }

  private editMembresiaPromocion(): Partial<Observer<MembresiaPromocion>> {
    return {
      next: (res: MembresiaPromocion) => {
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al actualizar membresia-promocion:', error);
      }
    }
  }

  private deleteMembresiaPromocion(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Membresia con promoción eliminada con exito', detail: 'Membresia con promoción eliminada' });
        this.loadMembresias();
      },
      error: (error) => {
        console.error('Error al eliminar una membresia con promoción:', error);
      }
    }
  }


  async buildFormFieldsExpansion(mode: 'create' | 'edit', id: string ): Promise<FormField<MembresiaPromocion>[]> {
      const fields: FormField<MembresiaPromocion>[] = [];

      try {
        const membresiasDropdown = await firstValueFrom(this.membresiaService.getMembresiasForDropdown());
        const promocionesDropdown = await firstValueFrom(this.promocionService.getPromocionesForDropdown());

        const membresiaField: FormField<MembresiaPromocion> = {
          name: 'idMembresia',
          label: 'Membresia',
          type: 'dropdown',
          readonly: true,
          validators: [Validators.required],
          options: membresiasDropdown,
          defaultValue: id
        };

        const promocionField: FormField<MembresiaPromocion> = {
          name: 'idPromocion',
          label: 'Promocion',
          type: 'dropdown',
          validators: [Validators.required],
          options: promocionesDropdown,
          defaultValue: null
        };

        fields.push(membresiaField, promocionField);

      } catch (error) {
        console.error('Error al cargar membresia o promociones para dropdown:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las membresias o promociones.'
        });

      }

      return fields;
    }


}
