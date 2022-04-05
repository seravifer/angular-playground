import {
  HostListener,
  OnInit,
  OnDestroy,
  Directive,
  Input,
} from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { Subscription } from 'rxjs';
import { Table } from '../table.component';

@Directive({
  selector: '[pSortableColumn]',
  host: {
    '[class.p-sortable-column]': 'isEnabled()',
    '[class.p-highlight]': 'sorted',
    '[attr.tabindex]': 'isEnabled() ? "0" : null',
    '[attr.role]': '"columnheader"',
    '[attr.aria-sort]': 'sortOrder',
  },
})
export class SortableColumn implements OnInit, OnDestroy {
  @Input('pSortableColumn') field: string;

  @Input() pSortableColumnDisabled: boolean;

  sorted: boolean;

  sortOrder: string;

  subscription: Subscription;

  constructor(public dt: Table) {
    if (this.isEnabled()) {
      this.subscription = this.dt.tableService.sortSource$.subscribe(
        (sortMeta) => {
          this.updateSortState();
        }
      );
    }
  }

  ngOnInit() {
    if (this.isEnabled()) {
      this.updateSortState();
    }
  }

  updateSortState() {
    this.sorted = this.dt.isSorted(this.field);
    this.sortOrder = this.sorted
      ? this.dt.sortOrder === 1
        ? 'ascending'
        : 'descending'
      : 'none';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isEnabled() && !this.isFilterElement(<HTMLElement>event.target)) {
      this.updateSortState();
      this.dt.sort({
        originalEvent: event,
        field: this.field,
      });

      DomHandler.clearSelection();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKey(event: MouseEvent) {
    this.onClick(event);
  }

  isEnabled() {
    return this.pSortableColumnDisabled !== true;
  }

  isFilterElement(element: HTMLElement) {
    return (
      DomHandler.hasClass(element, 'pi-filter-icon') ||
      DomHandler.hasClass(element, 'p-column-filter-menu-button')
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
