import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { Observer } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

import { GenericTableComponent } from "../../components/generic-table/generic-table.component";
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { FilterValues, FormField } from '../../interfaces/form-field.interface';
import { TableConfig } from '../../interfaces/table-config.interface';


interface Columnas {
  field: string;
  header: string;
  type: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    TableComponent,
    GenericTableComponent,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    GenericFormComponent,
    DialogModule,
],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly usuarioService = inject(UsuarioService);


  usuarios!: Usuario[];
  columnas!: Columnas[];
  totalRecords: number = 0;
  loading: boolean = false;
  displayDialog = false;
  selectedUser!: Usuario;
  selectDniUser!: string;
  titleDialog!: string;
  mode!: 'create' | 'edit';

  // Campo para el formulario generico
  formFields!: FormField<Usuario>[];

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
      { field: 'estado', header: 'Estado', dataType: 'text', filterable: true, filterType: 'select', filterOptions: [
        { label: 'Activo', value: 'activo' },
        { label: 'Suspendido', value: 'suspendido' },
        { label: 'Inactivo', value: 'inactivo' },
      ]},
    ],
    menuMode: 'menu',
    showBtnLimpiarFiltros: true
  };


  updateUser(usuario: Usuario){
    this.displayDialog = false;

    switch (this.mode) {
      case 'create':
        this.usuarioService.createUser(usuario).subscribe(this.createUsuario());
        break;
      case 'edit':
        this.usuarioService.updateUserById(this.selectDniUser, usuario).subscribe(this.editUsuario());
        break;
      default:
        console.warn('Modo desconocido en updateUser');
    }
  }

  onCreateUser(showModal: boolean) {
    this.mode = 'create';
    this.formFields = this.buildFormFields(this.mode);
    this.selectedUser = {} as Usuario;
    this.titleDialog = 'Crear Usuario';
    this.displayDialog = showModal;
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

  onDeleteUser(dni: string) {
    console.log('Eliminar usuario:', dni);
    // Aquí implementar la lógica para eliminar
    // Puedes mostrar un diálogo de confirmación antes
  }


  handleCancel(formRef: GenericFormComponent<Usuario>) {
    formRef.resetForm();
    this.selectedUser = {} as Usuario;
    this.displayDialog = false;
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


  private createUsuario(): Partial<Observer<Usuario>> {
    return {
      next: (res: Usuario) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      }
    }
  }

  private editUsuario(): Partial<Observer<Usuario>> {
    return {
      next: (res: Usuario) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    }
  }


  buildFormFields(mode: 'create' | 'edit'): FormField<Usuario>[] {
    const fields: FormField<Usuario>[] = [
      { name: 'dni', label: 'DNI', type: 'text', validators: [Validators.required], disabled: mode === 'edit' },
      { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
      { name: 'apellidos', label: 'Apellidos', type: 'text', validators: [Validators.required] },
      { name: 'email', label: 'Correo electrónico', type: 'email', validators: [Validators.required], disabled: mode === 'edit' },
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





}
