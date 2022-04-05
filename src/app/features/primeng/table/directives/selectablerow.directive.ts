import {
  HostListener,
  OnInit,
  OnDestroy,
  Directive,
  Input,
} from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { Subscription } from 'rxjs';
import { TableService } from '../table.service';
import { Table } from '../table.component';

@Directive({
  selector: '[pSelectableRow]',
  host: {
    '[class.p-selectable-row]': 'isEnabled()',
    '[class.p-highlight]': 'selected',
    '[attr.tabindex]': 'isEnabled() ? 0 : undefined',
  },
})
export class SelectableRow implements OnInit, OnDestroy {
  @Input('pSelectableRow') data: any;

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

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isEnabled()) {
      this.dt.handleRowClick({
        originalEvent: event,
        rowData: this.data,
        rowIndex: this.index,
      });
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: Event) {
    if (this.isEnabled()) {
      this.dt.handleRowTouchEnd(event);
    }
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDownKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled()) {
      return;
    }

    const row = <HTMLTableRowElement>event.currentTarget;
    const nextRow = this.findNextSelectableRow(row);

    if (nextRow) {
      nextRow.focus();
    }

    event.preventDefault();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUpKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled()) {
      return;
    }

    const row = <HTMLTableRowElement>event.currentTarget;
    const prevRow = this.findPrevSelectableRow(row);

    if (prevRow) {
      prevRow.focus();
    }

    event.preventDefault();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.shift.enter', ['$event'])
  @HostListener('keydown.meta.enter', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled()) {
      return;
    }

    this.dt.handleRowClick({
      originalEvent: event,
      rowData: this.data,
      rowIndex: this.index,
    });
  }

  @HostListener('keydown.pagedown')
  @HostListener('keydown.pageup')
  @HostListener('keydown.home')
  @HostListener('keydown.end')
  onPageDownKeyDown() {
    if (this.dt.virtualScroll) {
      this.dt.virtualScrollBody.elementRef.nativeElement.focus();
    }
  }

  @HostListener('keydown.space')
  onSpaceKeydown() {
    if (this.dt.virtualScroll && !this.dt.editingCell) {
      this.dt.virtualScrollBody.elementRef.nativeElement.focus();
    }
  }

  findNextSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement {
    let nextRow = <HTMLTableRowElement>row.nextElementSibling;
    if (nextRow) {
      if (DomHandler.hasClass(nextRow, 'p-selectable-row')) return nextRow;
      else return this.findNextSelectableRow(nextRow);
    } else {
      return null;
    }
  }

  findPrevSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement {
    let prevRow = <HTMLTableRowElement>row.previousElementSibling;
    if (prevRow) {
      if (DomHandler.hasClass(prevRow, 'p-selectable-row')) return prevRow;
      else return this.findPrevSelectableRow(prevRow);
    } else {
      return null;
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
