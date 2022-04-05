import { HostListener, Directive } from '@angular/core';
import { Table } from '../table.component';
import { EditableRow } from './editablerow.directive';

@Directive({
  selector: '[pSaveEditableRow]',
})
export class SaveEditableRow {
  constructor(public dt: Table, public editableRow: EditableRow) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    this.dt.saveRowEdit(
      this.editableRow.data,
      this.editableRow.el.nativeElement
    );
    event.preventDefault();
  }
}
