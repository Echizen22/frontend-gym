
type FieldType = 'text' | 'number' | 'date' | 'select' | 'boolean' | 'img';
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

export interface ExpansionConfig<T = any, E = any> {
  dataField: keyof T & string; // Campo que contiene los datos expandidos (ej: 'usuarioMembresia')
  title?: string;              // Título opcional para la sección expandida
  columns?: TableColumn<E>[];  // Columnas para la tabla anidada
  emptyMessage?: string;       // Mensaje cuando no hay datos
  lazyLoad?: boolean;          // Si los datos se cargan bajo demanda
  template?: any;   // Referencia a TemplateRef para contenido personalizado
  object?: boolean;
}


export interface TableConfig< T = any, E = any> {
  columns: TableColumn<T>[];
  menuMode: 'menu' | 'row';
  showBtnLimpiarFiltros: boolean;
  showRowExpansion?: boolean;
  expansionConfig?: ExpansionConfig<T, E>;
  dataKey?: keyof T & string;
}
