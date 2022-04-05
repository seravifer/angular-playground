import {
  Component,
  OnDestroy,
  AfterViewInit,
  Input,
  ElementRef,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils } from 'primeng/utils';
import { Subscription } from 'rxjs';
import { TableService } from '../table.service';
import { Table } from '../table.component';

@Component({
  selector: '[pTableBody]',
  template: `
    <ng-container *ngIf="!dt.expandedRowTemplate && !dt.virtualScroll">
      <ng-template
        ngFor
        let-rowData
        let-rowIndex="index"
        [ngForOf]="value"
        [ngForTrackBy]="dt.rowTrackBy"
      >
        <ng-container
          *ngIf="
            dt.groupHeaderTemplate &&
            dt.rowGroupMode === 'subheader' &&
            shouldRenderRowGroupHeader(value, rowData, rowIndex)
          "
          role="row"
        >
          <ng-container
            *ngTemplateOutlet="
              dt.groupHeaderTemplate;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.rowGroupMode !== 'rowspan'">
          <ng-container
            *ngTemplateOutlet="
              template;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.rowGroupMode === 'rowspan'">
          <ng-container
            *ngTemplateOutlet="
              template;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen,
                rowgroup: shouldRenderRowspan(value, rowData, rowIndex),
                rowspan: calculateRowGroupSize(value, rowData, rowIndex)
              }
            "
          ></ng-container>
        </ng-container>
        <ng-container
          *ngIf="
            dt.groupFooterTemplate &&
            dt.rowGroupMode === 'subheader' &&
            shouldRenderRowGroupFooter(value, rowData, rowIndex)
          "
          role="row"
        >
          <ng-container
            *ngTemplateOutlet="
              dt.groupFooterTemplate;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="!dt.expandedRowTemplate && dt.virtualScroll">
      <ng-template
        cdkVirtualFor
        let-rowData
        let-rowIndex="index"
        [cdkVirtualForOf]="dt.filteredValue || dt.value"
        [cdkVirtualForTrackBy]="dt.rowTrackBy"
        [cdkVirtualForTemplateCacheSize]="0"
      >
        <ng-container
          *ngTemplateOutlet="
            rowData ? template : dt.loadingBodyTemplate;
            context: {
              $implicit: rowData,
              rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
              columns: columns,
              editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
              frozen: frozen
            }
          "
        ></ng-container>
      </ng-template>
    </ng-container>
    <ng-container
      *ngIf="
        dt.expandedRowTemplate && !(frozen && dt.frozenExpandedRowTemplate)
      "
    >
      <ng-template
        ngFor
        let-rowData
        let-rowIndex="index"
        [ngForOf]="value"
        [ngForTrackBy]="dt.rowTrackBy"
      >
        <ng-container *ngIf="!dt.groupHeaderTemplate">
          <ng-container
            *ngTemplateOutlet="
              template;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                expanded: dt.isRowExpanded(rowData),
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
        <ng-container
          *ngIf="
            dt.groupHeaderTemplate &&
            dt.rowGroupMode === 'subheader' &&
            shouldRenderRowGroupHeader(value, rowData, rowIndex)
          "
          role="row"
        >
          <ng-container
            *ngTemplateOutlet="
              dt.groupHeaderTemplate;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                expanded: dt.isRowExpanded(rowData),
                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.isRowExpanded(rowData)">
          <ng-container
            *ngTemplateOutlet="
              dt.expandedRowTemplate;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                frozen: frozen
              }
            "
          ></ng-container>
          <ng-container
            *ngIf="
              dt.groupFooterTemplate &&
              dt.rowGroupMode === 'subheader' &&
              shouldRenderRowGroupFooter(value, rowData, rowIndex)
            "
            role="row"
          >
            <ng-container
              *ngTemplateOutlet="
                dt.groupFooterTemplate;
                context: {
                  $implicit: rowData,
                  rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                  columns: columns,
                  expanded: dt.isRowExpanded(rowData),
                  editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                  frozen: frozen
                }
              "
            ></ng-container>
          </ng-container>
        </ng-container>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="dt.frozenExpandedRowTemplate && frozen">
      <ng-template
        ngFor
        let-rowData
        let-rowIndex="index"
        [ngForOf]="value"
        [ngForTrackBy]="dt.rowTrackBy"
      >
        <ng-container
          *ngTemplateOutlet="
            template;
            context: {
              $implicit: rowData,
              rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
              columns: columns,
              expanded: dt.isRowExpanded(rowData),
              editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
              frozen: frozen
            }
          "
        ></ng-container>
        <ng-container *ngIf="dt.isRowExpanded(rowData)">
          <ng-container
            *ngTemplateOutlet="
              dt.frozenExpandedRowTemplate;
              context: {
                $implicit: rowData,
                rowIndex: dt.paginator ? dt.first + rowIndex : rowIndex,
                columns: columns,
                frozen: frozen
              }
            "
          ></ng-container>
        </ng-container>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="dt.loading">
      <ng-container
        *ngTemplateOutlet="
          dt.loadingBodyTemplate;
          context: { $implicit: columns, frozen: frozen }
        "
      ></ng-container>
    </ng-container>
    <ng-container *ngIf="dt.isEmpty() && !dt.loading">
      <ng-container
        *ngTemplateOutlet="
          dt.emptyMessageTemplate;
          context: { $implicit: columns, frozen: frozen }
        "
      ></ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class TableBody implements AfterViewInit, OnDestroy {
  @Input('pTableBody') columns: any[];

  @Input('pTableBodyTemplate') template: TemplateRef<any>;

  @Input() get value(): any[] {
    return this._value;
  }
  set value(val: any[]) {
    this._value = val;
    if (this.frozenRows) {
      this.updateFrozenRowStickyPosition();
    }

    if (this.dt.scrollable && this.dt.rowGroupMode === 'subheader') {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  }

  @Input() frozen: boolean;

  @Input() frozenRows: boolean;

  subscription: Subscription;

  _value: any[];

  ngAfterViewInit() {
    if (this.frozenRows) {
      this.updateFrozenRowStickyPosition();
    }

    if (this.dt.scrollable && this.dt.rowGroupMode === 'subheader') {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  }

  constructor(
    public dt: Table,
    public tableService: TableService,
    public cd: ChangeDetectorRef,
    public el: ElementRef
  ) {
    this.subscription = this.dt.tableService.valueSource$.subscribe(() => {
      if (this.dt.virtualScroll) {
        this.cd.detectChanges();
      }
    });
  }

  shouldRenderRowGroupHeader(value, rowData, i) {
    let currentRowFieldData = ObjectUtils.resolveFieldData(
      rowData,
      this.dt.groupRowsBy
    );
    let prevRowData = value[i - 1];
    if (prevRowData) {
      let previousRowFieldData = ObjectUtils.resolveFieldData(
        prevRowData,
        this.dt.groupRowsBy
      );
      return currentRowFieldData !== previousRowFieldData;
    } else {
      return true;
    }
  }

  shouldRenderRowGroupFooter(value, rowData, i) {
    let currentRowFieldData = ObjectUtils.resolveFieldData(
      rowData,
      this.dt.groupRowsBy
    );
    let nextRowData = value[i + 1];
    if (nextRowData) {
      let nextRowFieldData = ObjectUtils.resolveFieldData(
        nextRowData,
        this.dt.groupRowsBy
      );
      return currentRowFieldData !== nextRowFieldData;
    } else {
      return true;
    }
  }

  shouldRenderRowspan(value, rowData, i) {
    let currentRowFieldData = ObjectUtils.resolveFieldData(
      rowData,
      this.dt.groupRowsBy
    );
    let prevRowData = value[i - 1];
    if (prevRowData) {
      let previousRowFieldData = ObjectUtils.resolveFieldData(
        prevRowData,
        this.dt.groupRowsBy
      );
      return currentRowFieldData !== previousRowFieldData;
    } else {
      return true;
    }
  }

  calculateRowGroupSize(value, rowData, index) {
    let currentRowFieldData = ObjectUtils.resolveFieldData(
      rowData,
      this.dt.groupRowsBy
    );
    let nextRowFieldData = currentRowFieldData;
    let groupRowSpan = 0;

    while (currentRowFieldData === nextRowFieldData) {
      groupRowSpan++;
      let nextRowData = value[++index];
      if (nextRowData) {
        nextRowFieldData = ObjectUtils.resolveFieldData(
          nextRowData,
          this.dt.groupRowsBy
        );
      } else {
        break;
      }
    }

    return groupRowSpan === 1 ? null : groupRowSpan;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateFrozenRowStickyPosition() {
    this.el.nativeElement.style.top =
      DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling) +
      'px';
  }

  updateFrozenRowGroupHeaderStickyPosition() {
    if (this.el.nativeElement.previousElementSibling) {
      let tableHeaderHeight = DomHandler.getOuterHeight(
        this.el.nativeElement.previousElementSibling
      );
      this.dt.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
    }
  }
}
