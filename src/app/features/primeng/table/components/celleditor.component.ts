import {
  Component,
  Optional,
  AfterContentInit,
  ContentChildren,
  TemplateRef,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { EditableColumn } from '../directives/editablecolumn.directive';
import { EditableRow } from '../directives/editablerow.directive';
import { Table } from '../table.component';

@Component({
  selector: 'p-cellEditor',
  template: `
    <ng-container *ngIf="editing">
      <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
    </ng-container>
    <ng-container *ngIf="!editing">
      <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CellEditor implements AfterContentInit {
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  inputTemplate: TemplateRef<any>;

  outputTemplate: TemplateRef<any>;

  constructor(
    public dt: Table,
    @Optional() public editableColumn: EditableColumn,
    @Optional() public editableRow: EditableRow
  ) {}

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'input':
          this.inputTemplate = item.template;
          break;

        case 'output':
          this.outputTemplate = item.template;
          break;
      }
    });
  }

  get editing(): boolean {
    return (
      (this.dt.editingCell &&
        this.editableColumn &&
        this.dt.editingCell === this.editableColumn.el.nativeElement) ||
      (this.editableRow &&
        this.dt.editMode === 'row' &&
        this.dt.isRowEditing(this.editableRow.data))
    );
  }
}
