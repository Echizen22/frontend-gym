import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Usuario } from '../../interfaces/usuario.interface';
import { InputNumberModule } from 'primeng/inputnumber';
import { FilterValues, FormField } from '../../interfaces/form-field.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'admin-generic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    CalendarModule,
    PasswordModule,
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss'
})
export class GenericFormComponent<T extends Record<string, any>> implements OnChanges {

  @Input() formFields!: FormField<T>[];
  @Input() formFieldsValues!: T;
  @Input() mode!: 'create' | 'edit';
  @Output() onEntity = new EventEmitter<T>();

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ) {}


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta si cambian los campos o los valores
    if (changes['formFields'] || changes['formFieldsValues']) {
      this.createForm();
      if (this.formFieldsValues) {
        this.form.patchValue(this.formFieldsValues);
      }
    }
  }


  private createForm(): void {
    const formGroup: Record<string, any> = {};
    this.formFields?.forEach(field => {
      const key = field.name as keyof T;
      let value = this.formFieldsValues?.[key] ?? field.defaultValue ?? null;

      // Si el tipo es 'date' y el valor es string, lo convertimos
      if (field.type === 'date' && typeof value === 'string') {
        const parsed = new Date(value);
        value = isNaN(parsed.getTime()) ? null : parsed;
      }

      const control = this.fb.control(
        { value, disabled: field.disabled ?? false },
        field.validators || []
      )

      formGroup[field.name] = control;
    });
    this.form = this.fb.group(formGroup);
  }


  submitForm(): void {
    if (this.form.valid) {
      this.onEntity.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() {
    const defaultValues = this.formFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? null;
      return acc;
    }, {} as Partial<T>);

    this.form.reset(defaultValues);
  }


  enable(control: string) {
    const formControl = this.form.get(control);

    if (!formControl) return;

    formControl.disabled
      ? formControl.enable()
      : formControl.disable();
  }

  private markAllAsTouched() {
    Object.values(this.form.controls).forEach( control => {
      control.markAsTouched();
    });
  }

}
