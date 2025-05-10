import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DateFormatPipe } from '../../../pipes/unix-to-date.pipe';
import { Usuario } from '../../../admin/interfaces/usuario.interface';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ValidatorsService } from '../../../validators/Validators.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    DateFormatPipe,
    ReactiveFormsModule,
    InputTextModule,

    CardModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    CalendarModule,
    ToastModule,
  ],
  providers: [
    AuthService,
    UsuarioService,
    MessageService,
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {

  private fb = inject(FormBuilder);
  public editMode = signal(false);

  public form!: FormGroup;
  user!: Usuario;

  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly messageService: MessageService,
    private readonly validatorsService: ValidatorsService,
  ) {
  }


  ngOnInit(): void {

    const currentUser = this.authService.getCurrentUser();
    this.usuarioService.getUserById(currentUser.dni).subscribe({
      next: (res) => {
        this.user = res;
        this.initForm(res);
      },
      error: (err) => {
        console.error(err.error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar los datos del usuario',
          detail: err?.error?.message || 'Hubo un problema al cargar los datos del usuario.',
          life: 4000
        });
      }
    })


  }

  toggleEdit(): void {
    this.editMode.update(v => !v);
  }

  private initForm(user: Usuario): void {
    this.form = this.fb.group({
      nombre: [user.nombre, [Validators.required, Validators.maxLength(30) ]],
      apellidos: [user.apellidos, [Validators.required, Validators.maxLength(60) ]],
      email: [user.email, [Validators.required, Validators.pattern( this.validatorsService.emailPattern )], [ this.validatorsService.emailExisteValidator() ]],
      telefono: [user.telefono, [ Validators.pattern(/^[6-9]\d{8}$/) ]],
      fechaRegistro: [{ value: user.fechaRegistro, disabled: true }],
    });
  }

  isValidField( field: string, errorType: string ) {
    return this.validatorsService.isValidField( this.form, field, errorType );
  }


  guardarCambios(): void {
    if (this.form.invalid) return;

    const formData = this.form.getRawValue();
    const updatedFields: Partial<Usuario> = {};

    // Solo agrega campos que han cambiado
    for (const key of Object.keys(formData) as (keyof Usuario)[]) {
      const newValue = formData[key];
      const originalValue = this.user[key];

      // Verifica si el valor ha cambiado y no está vacío
      if (newValue !== originalValue && newValue !== '' && newValue !== null && newValue !== undefined) {
        updatedFields[key] = newValue;
      }
    }

    // Si no hay cambios, salimos
    if (Object.keys(updatedFields).length === 0) {
      console.log('No hay cambios');
      // this.editMode.set(false);
      this.messageService.add({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'No se realizaron modificaciones.',
        life: 3000
      });
      return;
    }


    this.usuarioService.updateUserForProfileById(this.user.dni, updatedFields).subscribe({
      next: (res) => {
        this.user = { ...res };
        this.editMode.set(false);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: err?.error?.message || 'Hubo un problema al guardar los cambios.',
          life: 4000
        });
      }
    });
  }

}
