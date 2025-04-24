import { ValidatorFn } from "@angular/forms";

type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'boolean' | 'email' | 'password';

interface optionsDropDown {
  label: string;
  value: string
}


export interface FormField<T = any> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  disabled?: boolean;
  hidden?: boolean;
  options?: optionsDropDown[];
  placeholder?: string;
  defaultValue?: any;
  clear?: boolean;
  validators?: ValidatorFn[];
  showEnabledFieldButton?: boolean;
}


export interface FilterValues {
  [key: string]: any;
}
