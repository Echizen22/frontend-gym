import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormField } from '../../interfaces/form-field.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';



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
    CommonModule,
    InputTextareaModule,
    AutoCompleteModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss'
})
export class GenericFormComponent<T extends Record<string, any>> implements OnChanges, OnDestroy {


  @Input() formFields!: FormField<T>[];
  @Input() formFieldsValues!: T;
  @Input() mode!: 'create' | 'edit';
  @Output() onEntity = new EventEmitter<T>();

  formReady!: boolean;

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService
  ) {}


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta si cambian los campos o los valores
    if (changes['formFields'] || changes['formFieldsValues']) {
      this.formReady = false;
      this.createForm();
      if (this.formFieldsValues) {
        this.form.patchValue(this.formFieldsValues);
      }

      queueMicrotask(() => this.formReady = true);
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

  ngOnDestroy(): void {
    this.form.reset();
  }


  submitForm(): void {
    if (this.form.valid) {
      this.onEntity.emit(this.form.value);
    } else {
      this.markAllAsTouched();
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


  filteredAutocomplete: Record<string, any[]> = {};

  onCompleteMethod(event: any, fieldName: string) {
    const query = event.query.toLowerCase();
    const field = this.formFields.find(f => f.name === fieldName);
    if (!field || !field.options) return;

    this.filteredAutocomplete[fieldName] = field.options.filter(opt =>
      opt.label.toLowerCase().includes(query)
    );
  }

  onAutoCompleteSelect(event: any, fieldName: string ) {
    const selected = event.value.value;
    this.form.get(fieldName)?.setValue(selected.value);
  }


  // AutoComplete con Deepseek
  getFilteredSuggestions(fieldName: string, defaultSuggestions: any[]): any[] {
    return this.filteredAutocomplete[fieldName] || defaultSuggestions;
  }

  filterAutocomplete(event: any, field: FormField<any>) {
    const query = event.query.toLowerCase();
    if (field.completeMethod) {
      field.completeMethod(event);
    } else if (field.options) {
      this.filteredAutocomplete[field.name as string] = field.options.filter(opt => {
        // Usamos el optionLabel o 'label' por defecto
        const labelField = field.optionLabel || 'label';
        return opt[labelField]?.toLowerCase().includes(query);
      });
    }
  }

  handleAutocompleteSelect(event: any, field: FormField<any>) {
    if (field.onSelect) {
      field.onSelect(event);
    } else {
      // Manejo por defecto más seguro
      const selectedValue = event.value;
      let valueToSet: any;

      if (field.returnObject) {
        valueToSet = selectedValue;
      } else {
        // Verificamos si existe la propiedad value
        valueToSet = selectedValue?.value ?? selectedValue;
      }

      this.form.get(field.name as string)?.setValue(valueToSet);
    }
  }


  // FileUpload

  // Maneja la selección de archivos
  handleFileSelect(event: any, fieldName: string | number | symbol) {
    const files = event.files;
    this.form.get(fieldName as string)?.setValue(files);
    this.form.get(fieldName as string)?.markAsDirty();
  }

  // Maneja la subida exitosa
  handleFileUpload(event: any, fieldName: string | number | symbol) {
    const response = event.originalEvent.body; // Asume que el servidor devuelve la URL del archivo
    this.form.get(fieldName as string)?.setValue(response.fileUrl);
  }

  // Maneja errores
  handleUploadError(event: any) {
    console.error('Error al subir archivo:', event);
    // Puedes emitir un evento o mostrar un mensaje
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al subir el archivo'
    });
  }

  // Obtiene mensajes de error
  getFileUploadError(fieldName: string | number | symbol): string {
    const errors = this.form.get(fieldName as string)?.errors;
    if (!errors) return '';

    if (errors['maxFileSize']) {
      return 'El archivo excede el tamaño máximo permitido';
    }
    if (errors['fileType']) {
      return 'Tipo de archivo no permitido';
    }
    return 'Error en el archivo';
  }


}
