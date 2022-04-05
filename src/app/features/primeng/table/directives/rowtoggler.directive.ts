import { HostListener, Directive, Input } from '@angular/core';
import { Table } from '../table.component';

@Directive({
  selector: '[pRowToggler]',
})
export class RowToggler {
  @Input('pRowToggler') data: any;

  @Input() pRowTogglerDisabled: boolean;

  constructor(public dt: Table) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isEnabled()) {
      this.dt.toggleRow(this.data, event);
      event.preventDefault();
    }
  }

  isEnabled() {
    return this.pRowTogglerDisabled !== true;
  }
}
