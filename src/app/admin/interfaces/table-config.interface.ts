
type FieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';
type FilterType = 'text' | 'numeric' | 'date' | 'select' | 'boolean';

export interface TableColumn< T = any> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  dataType?: FieldType;
  width?: string;
  hasActions?: boolean;
  object?: boolean;
  filterable: boolean;
  filterType: FilterType;
  filterOptions?: { label: string; value: any }[];
  responsiveClass?: string;
  selectBg?: boolean;
}


export interface TableConfig< T = any> {
  columns: TableColumn<T>[];
  menuMode: 'menu' | 'row';
  showBtnLimpiarFiltros: boolean;
  showRowExpansion?: boolean;
}
