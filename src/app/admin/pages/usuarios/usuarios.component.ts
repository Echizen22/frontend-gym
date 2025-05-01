import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Usuario, UsuarioMembresia } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { firstValueFrom, Observer } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

import { GenericTableComponent } from "../../components/generic-table/generic-table.component";
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';
import { MessageService } from 'primeng/api';
import { MembresiaService } from '../../services/membresia.service';
import { ToastModule } from 'primeng/toast';
import { PromocionService } from '../../services/promocion.service';


interface Columnas {
  field: string;
  header: string;
  type: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
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
  MembresiaService,
  PromocionService
],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly membresiaService = inject(MembresiaService);
  private readonly promocionService = inject(PromocionService);
  private messageService = inject( MessageService );


  usuarios!: Usuario[];
  columnas!: Columnas[];
  totalRecords: number = 0;
  loading: boolean = false;
  displayDialog = false;
  displayDialogExpansion = false;
  selectedUser!: Usuario;
  selectedUsuarioMembresia!: UsuarioMembresia;
  selectDniUser!: string;
  selectIdUserMembresia!: string;
  titleDialog!: string;
  titleDialogExpansion!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Usuario>[];
  formFieldsExpansion!: FormField<any>[];


  tableConfig: TableConfig = {
    columns: [
      { field: 'dni', header: 'DNI', dataType: 'text', filterable: true, filterType: 'text', width: '500px' },
      { field: 'nombre', header: 'Nombre', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'apellidos', header: 'Apellidos', dataType: 'text', filterable: true, filterType: 'text', responsiveClass: 'table-cell' },
      { field: 'email', header: 'Correo electrónico', dataType: 'text', filterable: true, filterType: 'text' },
      { field: 'isAdmin', header: 'administrador', dataType: 'boolean', filterable: true, filterType: 'boolean' },
      { field: 'fechaRegistro', header: 'Fecha Registro', dataType: 'date', filterable: true, filterType: 'date', responsiveClass: 'table-cell' },
      { field: 'fechaActualizacion', header: 'Fecha Actualización', dataType: 'date', filterable: true, filterType: 'date', responsiveClass: 'table-cell' },
      { field: 'telefono', header: 'Teléfono', dataType: 'text', filterable: true, filterType: 'text', responsiveClass: 'table-cell' },
      { field: 'estado', header: 'Estado', dataType: 'text', filterable: true, filterType: 'select', selectBg: true, filterOptions: [
        { label: 'Activo', value: 'activo' },
        { label: 'Suspendido', value: 'suspendido' },
        { label: 'Inactivo', value: 'inactivo' },
      ]},
    ],
    menuMode: 'menu',
    showBtnLimpiarFiltros: true,
    showRowExpansion: true,
    dataKey: 'dni',
    expansionConfig: {
      dataField: 'usuarioMembresia',
      title: 'Membresia del usuario',
      columns: [
        { field: 'membresia.nombre', header: 'Membresia', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
        { field: 'estado', header: 'Estado', sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
        { field: 'fechaIni', header: 'Fecha Inicio', sortable: true, dataType: 'date', filterable: true, filterType: 'date' },
        { field: 'fechaFin', header: 'Fecha Fin', sortable: true, dataType: 'date', filterable: true, filterType: 'date' },
        { field: 'promocion.nombre', header: 'Promoción', object: true, sortable: true, dataType: 'text', filterable: true, filterType: 'text' },
      ]
    }
  };


  updateUser(usuario: Usuario){
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.usuarioService.createUser(usuario).subscribe(this.createUser());
        break;
      case 'edit':
        this.usuarioService.updateUserById(this.selectDniUser, usuario).subscribe(this.editUser());
        break;
      default:
        console.warn('Modo desconocido en updateUser');
      }

  }

  updateUsuarioMembresia(usuarioMembresia: UsuarioMembresia){
    this.displayDialogExpansion = false;

    switch (this.mode) {
      case 'create':
        this.usuarioService.createUsuarioMembresia(usuarioMembresia).subscribe(this.createUsuarioMembresia());
        break;
      case 'edit':
        this.usuarioService.updateUsuarioMembresiaById(this.selectIdUserMembresia, usuarioMembresia).subscribe(this.editUsuarioMembresia());
        break;
      default:
        console.warn('Modo desconocido en updateUser-membresia');
    }
  }

  onCreateUser(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedUser = {} as Usuario;
    this.titleDialog = 'Crear Usuario';
    this.displayDialog = showModal;
  }

  async onCreateUsuarioMembresia(showModalExpansion: { id: string, showModal: boolean }) {
    this.mode = 'create';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, showModalExpansion.id);
    this.selectedUsuarioMembresia = {} as UsuarioMembresia;
    this.titleDialogExpansion = 'Crear Usuario con Membresia';
    this.displayDialogExpansion = showModalExpansion.showModal;
  }

  onEditUser(dni: string) {
    this.mode = 'edit';
    this.formFields = this.buildFormFields(this.mode);
    this.titleDialog = 'Editar Usuario';
    this.displayDialog = true;
    this.selectDniUser = dni;

    this.usuarioService.getUserById(dni).subscribe({
      next: (user: Usuario) => {
        const { fechaActualizacion, fechaRegistro, ...rest } = user;

        this.selectedUser = {
          fechaActualizacion: new Date(fechaActualizacion),
          fechaRegistro: new Date(fechaRegistro),
          ...rest
        };
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async onEditUserMembresia(ids: { id: string, idPadre: string}) {
    this.mode = 'edit';
    this.formFieldsExpansion = await this.buildFormFieldsExpansion(this.mode, ids.idPadre);
    this.titleDialogExpansion = 'Editar Usuario con Membresia';
    this.displayDialogExpansion = true;
    this.selectIdUserMembresia = ids.id;

    this.usuarioService.getUseMembresiarById(ids.id).subscribe({
      next: (respuesta) => {
        if( respuesta.membresia ) {

          if( respuesta.promocion ) {
            this.selectedUsuarioMembresia = {
              ...respuesta,
              idMembresia: respuesta.membresia.id,
              idPromocion: respuesta.promocion.id
            };
          } else {
            this.selectedUsuarioMembresia = {
              ...respuesta,
              idMembresia: respuesta.membresia.id
            };
          }


        }

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onDeleteUser(dni: string) {
    this.usuarioService.deleteUser(dni).subscribe(this.deleteUser());
  }

  onDeleteUserMembresia(dni: string) {
    this.usuarioService.deleteUserMembresia(dni).subscribe(this.deleteUserMembresia());
  }


  handleCancel(formRef: GenericFormComponent<Usuario>) {
    formRef.resetForm();
    this.selectedUser = {} as Usuario;
    this.displayDialog = false;
  }

  handleExpansionCancel(formRef: GenericFormComponent<UsuarioMembresia>) {
    formRef.resetForm();
    this.selectedUsuarioMembresia = {} as UsuarioMembresia;
    this.displayDialogExpansion = false;
  }


  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.usuarioService.getAllWithPagination().subscribe(this.getUsuarios());
  }

  private getUsuarios(): Partial<Observer<Usuario[]>> {
    return  {
      next: (res) => {
        this.usuarios = res.map( usuario => {
          usuario.fechaActualizacion = new Date(usuario.fechaActualizacion);
          usuario.fechaRegistro = new Date(usuario.fechaRegistro);
          return usuario
        });
        this.loading = false;

        // this.columnas = Object.keys(res);
      },
      error: (err) => {
        console.error(err);
      }
    }
  }


  private createUser(): Partial<Observer<Usuario>> {
    return {
      next: (res: Usuario) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      }
    }
  }

  private createUsuarioMembresia(): Partial<Observer<UsuarioMembresia>> {
    return {
      next: (res: UsuarioMembresia) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario-membresia:', error);
      }
    }
  }

  private editUser(): Partial<Observer<Usuario>> {
    return {
      next: (res: Usuario) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    }
  }

  private editUsuarioMembresia(): Partial<Observer<UsuarioMembresia>> {
    return {
      next: (res: UsuarioMembresia) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al actualizar usuario-membresia:', error);
      }
    }
  }

  private deleteUser(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Usuario eliminado con exito', detail: 'Usuario Eliminado' });
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al eliminar un usuario:', error);
      }
    }
  }

  private deleteUserMembresia(): Partial<Observer<void>> {
    return {
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Usuario con membresia eliminado con exito', detail: 'Usuario con membresia eliminado' });
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al eliminar un usuario con membresia:', error);
      }
    }
  }


  buildFormFields(mode: 'create' | 'edit'): FormField<Usuario>[] {
    const fields: FormField<Usuario>[] = [
      { name: 'dni', label: 'DNI', type: 'text', validators: [Validators.required], disabled: mode === 'edit' },
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'apellidos', label: 'Apellidos', type: 'text', validators: [Validators.required] },
      { name: 'email', label: 'Correo electrónico', type: 'email', validators: [Validators.required], disabled: mode === 'edit', showEnabledFieldButton: mode === 'edit' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'isAdmin', label: 'Administrador', type: 'boolean', defaultValue: false },
      {
        name: 'estado',
        label: 'Estados',
        type: 'dropdown',
        clear: false,
        validators: [Validators.required],
        options: [
          { label: 'Activo', value: 'activo' },
          { label: 'Suspendido', value: 'suspendido' },
          { label: 'Inactivo', value: 'inactivo' },

        ],
        defaultValue: 'activo'
      }
    ];


    if( mode === 'create') {
      fields.push({
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        validators: [Validators.required]
      });
    }

    return fields;

  }

  async buildFormFieldsExpansion(mode: 'create' | 'edit', id: string ): Promise<FormField<UsuarioMembresia>[]> {
    const fields: FormField<UsuarioMembresia>[] = [
      { name: 'estado', label: 'Estado', type: 'dropdown', options: [
        { label: 'Activa', value: 'activa'},
        { label: 'Cancelada', value: 'cancelada'},
        { label: 'Experida', value: 'expirada'},
      ]},
      { name: 'idUsuario', label: 'Usuario', type: 'text', readonly: true, defaultValue: id },
    ];

    if( mode === 'edit') {
      fields.map( field => {

        if( field.name === 'idUsuario') {
          field.readonly = false;
          field.disabled = true;
        }

        return field;

      });
    }



    try {
      const membresiasDropdown = await firstValueFrom(this.membresiaService.getMembresiasForDropdown());
      const promocionesDropdown = await firstValueFrom(this.promocionService.getPromocionesForDropdown());

      const membresiaField: FormField<UsuarioMembresia> = {
        name: 'idMembresia',
        label: 'Membresia',
        type: 'dropdown',
        validators: [Validators.required],
        options: membresiasDropdown,
        defaultValue: null
      };

      const promocionField: FormField<UsuarioMembresia> = {
        name: 'idPromocion',
        label: 'Promocion',
        type: 'dropdown',
        clear: true,
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
