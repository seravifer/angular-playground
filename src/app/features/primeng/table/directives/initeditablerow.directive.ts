import { HostListener, Directive } from '@angular/core';
import { Table } from '../table.component';
import { EditableRow } from './editablerow.directive';

@Directive({
  selector: '[pInitEditableRow]',
})
export class InitEditableRow {
  constructor(public dt: Table, public editableRow: EditableRow) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    this.dt.initRowEdit(this.editableRow.data);
    event.preventDefault();
  }
}
