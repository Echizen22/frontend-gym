
type FieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  dataType?: FieldType;
  width?: string;
  hasActions?: boolean;
  filterable: true;
  filterType: FieldType;
  filterOptions?: { label: string; value: any }[];
  responsiveClass?: string;
}


export interface TableConfig {
  columns: TableColumn[];
  menuMode: 'menu' | 'row';
  showBtnLimpiarFiltros: boolean;
}
