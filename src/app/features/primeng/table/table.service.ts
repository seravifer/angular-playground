/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { SortMeta } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable()
export class TableService {
  private sortSource = new Subject<SortMeta | SortMeta[]>();
  private selectionSource = new Subject();
  private contextMenuSource = new Subject<any>();
  private valueSource = new Subject<any>();
  private totalRecordsSource = new Subject<any>();
  private columnsSource = new Subject();
  private resetSource = new Subject();

  public sortSource$ = this.sortSource.asObservable();
  public selectionSource$ = this.selectionSource.asObservable();
  public contextMenuSource$ = this.contextMenuSource.asObservable();
  public valueSource$ = this.valueSource.asObservable();
  public totalRecordsSource$ = this.totalRecordsSource.asObservable();
  public columnsSource$ = this.columnsSource.asObservable();
  public resetSource$ = this.resetSource.asObservable();

  onSort(sortMeta: SortMeta | SortMeta[]) {
    this.sortSource.next(sortMeta);
  }

  onSelectionChange() {
    this.selectionSource.next(null);
  }

  onResetChange() {
    this.resetSource.next(null);
  }

  onContextMenu(data: any) {
    this.contextMenuSource.next(data);
  }

  onValueChange(value: any) {
    this.valueSource.next(value);
  }

  onTotalRecordsChange(value: number) {
    this.totalRecordsSource.next(value);
  }

  onColumnsChange(columns: any[]) {
    this.columnsSource.next(columns);
  }
}
