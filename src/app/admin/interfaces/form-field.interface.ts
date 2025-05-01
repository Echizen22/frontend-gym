import { ValidatorFn } from "@angular/forms";

type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'boolean' | 'email' | 'password' | 'textarea' | 'autocomplete' | 'fileUpload';
type NumberType = 'currency' | 'decimal';

export interface OptionsDropDown {
  label: string;
  value: any;
  [key: string]: any;
}



export interface FormField<T = any> {
  name: keyof T & string;
  inputName?: string;
  label: string;
  type: FieldType;
  disabled?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  currency?: boolean;
  numberType?: NumberType;
  options?: OptionsDropDown[];
  placeholder?: string;
  defaultValue?: any;
  clear?: boolean;
  validators?: ValidatorFn[];
  showEnabledFieldButton?: boolean;

  // Propiedades específicas para autocomplete
  optionLabel?: string;
  completeMethod?: (event: any) => void;
  suggestions?: any[];
  returnObject?: boolean;
  onSelect?: (event: any) => void; // <- Añade esta propiedad
  dropdown?: boolean;
  forceSelection?: boolean;


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
