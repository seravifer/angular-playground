import {
  HostListener,
  OnInit,
  OnDestroy,
  Directive,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TableService } from '../table.service';
import { Table } from '../table.component';

@Directive({
  selector: '[pSelectableRowDblClick]',
  host: {
    '[class.p-selectable-row]': 'isEnabled()',
    '[class.p-highlight]': 'selected',
  },
})
export class SelectableRowDblClick implements OnInit, OnDestroy {
  @Input('pSelectableRowDblClick') data: any;

  @Input('pSelectableRowIndex') index: number;

  @Input() pSelectableRowDisabled: boolean;

  selected: boolean;

  subscription: Subscription;

  constructor(public dt: Table, public tableService: TableService) {
    if (this.isEnabled()) {
      this.subscription = this.dt.tableService.selectionSource$.subscribe(
        () => {
          this.selected = this.dt.isSelected(this.data);
        }
      );
    }
  }

  ngOnInit() {
    if (this.isEnabled()) {
      this.selected = this.dt.isSelected(this.data);
    }
  }

  @HostListener('dblclick', ['$event'])
  onClick(event: Event) {
    if (this.isEnabled()) {
      this.dt.handleRowClick({
        originalEvent: event,
        rowData: this.data,
        rowIndex: this.index,
      });
    }
  }

  isEnabled() {
    return this.pSelectableRowDisabled !== true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
