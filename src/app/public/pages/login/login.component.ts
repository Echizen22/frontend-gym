import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );
  private messageService = inject( MessageService );


  public myForm: FormGroup = this.fb.group({
    email:      ['kathe@gmail.com'],
    password: ['Kathe_1234'],
  });


  login() {
    const { email, password } = this.myForm.value;

    this.authService.login( email, password )
      .subscribe({
        next: () => {
          if(this.authService.isAdmin()) {
            this.messageService.add({ severity: 'success', summary: 'Inicio de Sesión Exitoso', detail: 'Bienvenido Administrador' });
            setTimeout(() => {
              this.router.navigateByUrl('/admin');
            }, 2000)

          } else {

            this.messageService.add({ severity: 'success', summary: 'Inicio de Sesión Exitoso', detail: 'Bienvenido de nuevo.' });
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 2000)
          }

        },
        error: (message) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message.error.message });
        }
      });


  }

}
