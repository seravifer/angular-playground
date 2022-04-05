import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Table } from '../table.component';

@Component({
  selector: 'p-sortIcon',
  template: `
    <i
      class="p-sortable-column-icon pi pi-fw"
      [ngClass]="{
        'pi-sort-amount-up-alt': sortOrder === 1,
        'pi-sort-amount-down': sortOrder === -1,
        'pi-sort-alt': sortOrder === 0
      }"
    ></i>
    <span *ngIf="isMultiSorted()" class="p-sortable-column-badge">{{
      getBadgeValue()
    }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SortIcon implements OnInit, OnDestroy {
  @Input() field: string;

  subscription: Subscription;

  sortOrder: number;

  constructor(public dt: Table, public cd: ChangeDetectorRef) {
    this.subscription = this.dt.tableService.sortSource$.subscribe(
      (sortMeta) => {
        this.updateSortState();
      }
    );
  }

  ngOnInit() {
    this.updateSortState();
  }

  onClick(event) {
    event.preventDefault();
  }

  updateSortState() {
    if (this.dt.sortMode === 'single') {
      this.sortOrder = this.dt.isSorted(this.field) ? this.dt.sortOrder : 0;
    } else if (this.dt.sortMode === 'multiple') {
      let sortMeta = this.dt.getSortMeta(this.field);
      this.sortOrder = sortMeta ? sortMeta.order : 0;
    }

    this.cd.markForCheck();
  }

  getMultiSortMetaIndex() {
    let multiSortMeta = this.dt._multiSortMeta;
    let index = -1;

    if (
      multiSortMeta &&
      this.dt.sortMode === 'multiple' &&
      (this.dt.showInitialSortBadge || multiSortMeta.length > 1)
    ) {
      for (let i = 0; i < multiSortMeta.length; i++) {
        let meta = multiSortMeta[i];
        if (meta.field === this.field || meta.field === this.field) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  getBadgeValue() {
    let index = this.getMultiSortMetaIndex();

    return this.dt.groupRowsBy && index > -1 ? index : index + 1;
  }

  isMultiSorted() {
    return this.dt.sortMode === 'multiple' && this.getMultiSortMetaIndex() > -1;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
