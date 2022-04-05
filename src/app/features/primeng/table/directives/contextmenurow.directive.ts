import { HostListener, Directive, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableService } from '../table.service';
import { Table } from '../table.component';

@Directive({
  selector: '[pContextMenuRow]',
  host: {
    '[class.p-highlight-contextmenu]': 'selected',
    '[attr.tabindex]': 'isEnabled() ? 0 : undefined',
  },
})
export class ContextMenuRow {
  @Input('pContextMenuRow') data: any;

  @Input('pContextMenuRowIndex') index: number;

  @Input() pContextMenuRowDisabled: boolean;

  selected: boolean;

  subscription: Subscription;

  constructor(
    public dt: Table,
    public tableService: TableService,
    private el: ElementRef
  ) {
    if (this.isEnabled()) {
      this.subscription = this.dt.tableService.contextMenuSource$.subscribe(
        (data) => {
          this.selected = this.dt.equals(this.data, data);
        }
      );
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    if (this.isEnabled()) {
      this.dt.handleRowRightClick({
        originalEvent: event,
        rowData: this.data,
        rowIndex: this.index,
      });

      this.el.nativeElement.focus();
      event.preventDefault();
    }
  }

  isEnabled() {
    return this.pContextMenuRowDisabled !== true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
