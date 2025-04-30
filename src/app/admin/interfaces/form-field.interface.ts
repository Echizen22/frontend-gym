import { ValidatorFn } from "@angular/forms";

type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'boolean' | 'email' | 'password' | 'textarea' | 'autocomplete' | 'fileUpload';
type NumberType = 'currency' | 'decimal';

export interface OptionsDropDown {
  label: string;
  value: any
}



export interface FormField<T = any> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  disabled?: boolean;
  hidden?: boolean;
  currency?: boolean;
  numberType?: NumberType;
  options?: OptionsDropDown[];
  placeholder?: string;
  defaultValue?: any;
  clear?: boolean;
  validators?: ValidatorFn[];
  showEnabledFieldButton?: boolean;

  // Nuevas propiedades para autocomplete
  optionLabel?: string; // Campo a mostrar en las sugerencias
  completeMethod?: (event: any) => void; // Método para filtrar
  suggestions?: any[]; // Sugerencias disponibles


  // Propiedades especificas para fileUpload
  accept?: string;
  maxFileSize?: number;
  chooseLabel?: string;
  chooseIcon?: string;
  url?: string;
  multiple?: boolean;
  mode?: 'basic' | 'advanced';
}


export interface FilterValues {
  [key: string]: any;
}
