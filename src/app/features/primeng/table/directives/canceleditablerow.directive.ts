import { HostListener, Directive } from '@angular/core';
import { Table } from '../table.component';
import { EditableRow } from './editablerow.directive';

@Directive({
  selector: '[pCancelEditableRow]',
})
export class CancelEditableRow {
  constructor(public dt: Table, public editableRow: EditableRow) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    this.dt.cancelRowEdit(this.editableRow.data);
    event.preventDefault();
  }
}
