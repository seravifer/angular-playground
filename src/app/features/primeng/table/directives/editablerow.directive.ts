import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[pEditableRow]',
})
export class EditableRow {
  @Input('pEditableRow') data: any;

  @Input() pEditableRowDisabled: boolean;

  constructor(public el: ElementRef) {}

  isEnabled() {
    return this.pEditableRowDisabled !== true;
  }
}
