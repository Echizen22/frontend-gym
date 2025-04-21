import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { Observer } from 'rxjs';
import { ButtonModule } from 'primeng/button';


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
    ButtonModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {


  private readonly usuarioService = inject(UsuarioService);

  usuarios!: Usuario[];
  columnas!: Columnas[];

  loading!: boolean;


  ngOnInit(): void {
    this.loading = true;
    this.usuarioService.getAllWithPagination().subscribe(this.getUsuarios());

    this.columnas = [
      { field: 'dni', header: 'DNI', type: 'text' },
      { field: 'nombre', header: 'Nombre', type: 'text' },
      { field: 'apellidos', header: 'Apellidos', type: 'text' },
      { field: 'email', header: 'Correo Eléctronico', type: 'text' },
      { field: 'isAdmin', header: '¿Es administrador?', type: 'boolean' },
      { field: 'fechaRegistro', header: 'Fecha Registro', type: 'date' },
      { field: 'fechaActualizacion', header: 'Fecha Actualización', type: 'date' },
      { field: 'estado', header: 'Activo', type: 'text' }
    ];
  }


  search() {

  }

  reset() {

  }

  editar() {

  }

  eliminar() {

  }

  onDelete(id: string) {

  }

  private getUsuarios(): Partial<Observer<Usuario[]>> {
    return  {
      next: (res) => {
        console.log({res});
        this.usuarios = res;
        this.loading = false;

        // this.columnas = Object.keys(res);
      },
      error: (err) => {
        console.error(err);
      }
    }
  }


}
