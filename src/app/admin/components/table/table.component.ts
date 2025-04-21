import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { TableModule } from 'primeng/table';


@Component({
  selector: 'admin-component-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input() value: any[] = [];
  @Input() columns: { field: string; header: string; type: string }[] = [];

  @Input() rowActions?: TemplateRef<any>;
  @Input() headerActions?: TemplateRef<any>;

  @Input() loading!: boolean;

}
