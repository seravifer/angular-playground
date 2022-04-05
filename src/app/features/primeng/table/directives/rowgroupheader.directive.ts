import { Directive } from '@angular/core';
import { Table } from '../table.component';

@Directive({
  selector: '[pRowGroupHeader]',
  host: {
    class: 'p-rowgroup-header',
    '[style.top]': 'getFrozenRowGroupHeaderStickyPosition',
  },
})
export class RowGroupHeader {
  constructor(public dt: Table) {}

  get getFrozenRowGroupHeaderStickyPosition() {
    return this.dt.rowGroupHeaderStyleObject
      ? this.dt.rowGroupHeaderStyleObject.top
      : '';
  }
}
