import { ValidatorFn } from "@angular/forms";

type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'boolean' | 'email' | 'password' | 'textarea';
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
}


export interface FilterValues {
  [key: string]: any;
}
