import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OptionsDropDown } from '../../../admin/interfaces/form-field.interface';
import { Membresia } from '../../../admin/interfaces/membresia.interface';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MembresiaService } from '../../../admin/services/membresia.service';
import { Observer } from 'rxjs';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ValidatorsService } from '../../../validators/Validators.service';
import { Usuario, UsuarioMembresia } from '../../../admin/interfaces/usuario.interface';
import { RegisterResponse } from '../../../interfaces/register-response.interface';
import { UsuarioService } from '../../../admin/services/usuario.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    CalendarModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    ToastModule,
    CardModule,
  ],
  providers: [
    AuthService,
    MembresiaService,
    ValidatorsService,
    MessageService,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  myForm!: UntypedFormGroup;
  selectMembresia: OptionsDropDown[] = [];
  membresias!: Membresia[];

  private readonly fb = inject(UntypedFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly membresiaService = inject(MembresiaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly validatorsService = inject(ValidatorsService);
  private readonly messageService = inject(MessageService);

  idPromocion!: string;

  ngOnInit(): void {

    this.myForm = this.fb.group({
      dni: [, [ Validators.required, this.validatorsService.dniValidator()], [this.validatorsService.dniExisteValidator()]],
      nombre: [, [ Validators.required ]],
      apellidos: [, [ Validators.required ]],
      password: [, [ Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/) ]],
      email: [, [ Validators.required, Validators.pattern( this.validatorsService.emailPattern ) ], [ this.validatorsService.emailExisteValidator() ]],
      membresia: [, [ Validators.required ]],
      telefono: [, [ Validators.pattern(/^[6-9]\d{8}$/) ]],
    });

    // this.membresiaService.getMembresiasForDropdown().subscribe(this.getMembresiasDropdown());
    this.membresiaService.getMembresia().subscribe(this.getMembresiasDropdown());


  }

  private getMembresiasDropdown(): Partial<Observer<Membresia[]>> {
    return {
      next: (res) => {
        this.membresias = res;
      },
      error: (err) => {
        console.error(err.error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar las memebresias',
          detail: err?.error?.message || 'Hubo un problema al cargar las membresias.',
          life: 4000
        });

      }
    }
  }

  doSubmit() {
    if( this.myForm.valid) {

      const newUser: Usuario = {
        dni: this.myForm.value.dni,
        nombre: this.myForm.value.nombre,
        apellidos: this.myForm.value.apellidos,
        email: this.myForm.value.email,
        password: this.myForm.value.password,
        telefono: this.myForm.value.telefono,
      }

      this.authService.register(newUser).subscribe(this.getRegister());

    } else {
      this.myForm.markAllAsTouched();
      return;
    }
  }

  onResetForm() {
    this.myForm.reset();
  }

  isValidField( field: string, errorType: string ) {
    return this.validatorsService.isValidField( this.myForm, field, errorType );
  }

  private getRegister(): Partial<Observer<RegisterResponse>> {
    return {
      next: (res) => {

        const newUsuarioMembresia: UsuarioMembresia = {
          estado: 'activa',
          idUsuario: res.dni,
          idMembresia: this.myForm.value.membresia
        }


        if( this.idPromocion ) {
          newUsuarioMembresia['idPromocion'] = this.idPromocion;
        }


        this.usuarioService.createUsuarioMembresia(newUsuarioMembresia).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Registro completado',
              detail: '¡Tu cuenta ha sido creada con éxito! Ahora puedes iniciar sesión.',
              life: 3000
            });

            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 3000);
          },
          error: (err) => {
            console.error(err.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al registrarse',
              detail: err?.error?.message || 'Hubo un problema al registrarse.',
              life: 4000
            });
          }
        })

      },
      error: (err) => {
        console.error(err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrarse',
          detail: err?.error?.message || 'Hubo un problema al registrarse.',
          life: 4000
        });
      }
    }
  }



}
