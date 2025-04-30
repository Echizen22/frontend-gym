import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableColumn, TableConfig } from '../../interfaces/table-config.interface';
import { Usuario } from '../../interfaces/usuario.interface';


@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    CommonModule,
    TagModule,
    FormsModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {

  @Input() config!: TableConfig;
  @Input() data: any[] = [];
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() rows: number = 10;
  @Input() first: number = 0;

  // @Input() viewModal!: boolean;

  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();

  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() showModalCreate = new EventEmitter<boolean>();

  handleLazyLoad(event: TableLazyLoadEvent) {
    this.onLazyLoad.emit(event);
  }

  handleCreate() {
    this.showModalCreate.emit(true);
  }

  handleEdit(id: string) {
    this.onEdit.emit(id);
  }

  handleDelete(id: string) {
    this.onDelete.emit(id);
  }

  getSeverity(value: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (value) {
      case 'activo':
        return 'success';
      case 'suspendido':
        return 'warning';
      case 'inactivo':
        return 'danger';
      default:
        return 'info';
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

}
