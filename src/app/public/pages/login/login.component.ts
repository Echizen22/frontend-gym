import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ValidatorsService } from '../../../validators/Validators.service';
import { NewPassword } from '../../../admin/interfaces/usuario.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private usuarioService = inject( UsuarioService );
  private readonly validatorsService = inject(ValidatorsService);
  private router      = inject( Router );
  private messageService = inject( MessageService );

  showRecoveryPassword = false;
  emailVerificado: boolean | null = null;


  public myForm: FormGroup = this.fb.group({
    email:      [ , [Validators.email] ],
    password: [, []],
  });

  public myFormRecovery: FormGroup = this.fb.group({
    email:      [ , [Validators.email] ],
    newPassword: [, [ Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/) ]],
  });


  login() {
    const { email, password } = this.myForm.value;

    this.authService.login( email, password )
      .subscribe({
        next: () => {
          if(this.authService.isAdmin()) {
            this.router.navigateByUrl('/admin');
          } else {

            this.router.navigateByUrl('/');
          }

        },
        error: (message) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message.error.message });
        }
      });


  }


  recuperarContra() {
    this.showRecoveryPassword = true;

    this.myFormRecovery.get('email')?.valueChanges
    .pipe(
      debounceTime(500), // espera 500ms tras dejar de escribir
      distinctUntilChanged() // solo si cambia el valor
    )
    .subscribe((email: string) => {
      const control = this.myFormRecovery.get('email');

      if (control?.valid && email) {
        this.verificarCorreo(email);
      } else {
        this.emailVerificado = null;
      }
    });

  }

  recovery() {
    if(this.myFormRecovery.valid) {
      const email = this.myFormRecovery.get('email')?.value;
      const updateData: NewPassword = {
        'newPassword': this.myFormRecovery.get('newPassword')?.value
      }

      this.usuarioService.updateUserPassword(email, updateData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Contraseña actualizada',
            detail: response.message || 'La contraseña se actualizó correctamente',
          });
          this.volverLogin();
        },
        error: (err) => {
          console.error(err.error);
          this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'No se pudo actualizar la contraseña',
        });
        }
      });

    }
  }

  volverLogin() {
    this.showRecoveryPassword = false;
    this.emailVerificado = false;
    this.myForm.reset();
    this.myFormRecovery.reset()
  }

  verificarCorreo(email: string) {
    this.usuarioService.checkEamilExist(email).subscribe({
      next: (response) => {
        this.emailVerificado = response.exists;
      },
      error: () => {
        this.emailVerificado = false;
      }
    });
  }

  isValidField( field: string, errorType: string ) {
    return this.validatorsService.isValidField( this.myFormRecovery, field, errorType );
  }

}
