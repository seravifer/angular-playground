/* eslint-disable */
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ContentChildren,
  TemplateRef,
  QueryList,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import {
  PrimeTemplate,
  FilterMatchMode,
  FilterOperator,
  FilterService,
  OverlayService,
} from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { SortMeta } from 'primeng/api';
import { TableState } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
import { BlockableUI } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TableService } from './table.service';

@Component({
  selector: 'p-table',
  template: `
    <div
      #container
      [ngStyle]="style"
      [class]="styleClass"
      [ngClass]="{
        'p-datatable p-component': true,
        'p-datatable-hoverable-rows': rowHover || selectionMode,
        'p-datatable-auto-layout': autoLayout,
        'p-datatable-resizable': resizableColumns,
        'p-datatable-resizable-fit':
          resizableColumns && columnResizeMode === 'fit',
        'p-datatable-scrollable': scrollable,
        'p-datatable-scrollable-vertical':
          scrollable && scrollDirection === 'vertical',
        'p-datatable-scrollable-horizontal':
          scrollable && scrollDirection === 'horizontal',
        'p-datatable-scrollable-both': scrollable && scrollDirection === 'both',
        'p-datatable-flex-scrollable': scrollable && scrollHeight === 'flex',
        'p-datatable-responsive-stack': responsiveLayout === 'stack',
        'p-datatable-responsive-scroll': responsiveLayout === 'scroll',
        'p-datatable-responsive': responsive,
        'p-datatable-grouped-header': headerGroupedTemplate !== null,
        'p-datatable-grouped-footer': footerGroupedTemplate !== null
      }"
      [attr.id]="id"
    >
      <div
        class="p-datatable-loading-overlay p-component-overlay"
        *ngIf="loading && showLoader"
      >
        <i [class]="'p-datatable-loading-icon pi-spin ' + loadingIcon"></i>
      </div>
      <div *ngIf="captionTemplate" class="p-datatable-header">
        <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
      </div>
      <p-paginator
        [rows]="rows"
        [first]="first"
        [totalRecords]="totalRecords"
        [pageLinkSize]="pageLinks"
        styleClass="p-paginator-top"
        [alwaysShow]="alwaysShowPaginator"
        (onPageChange)="onPageChange($event)"
        [rowsPerPageOptions]="rowsPerPageOptions"
        *ngIf="
          paginator &&
          (paginatorPosition === 'top' || paginatorPosition === 'both')
        "
        [templateLeft]="paginatorLeftTemplate"
        [templateRight]="paginatorRightTemplate"
        [dropdownAppendTo]="paginatorDropdownAppendTo"
        [dropdownScrollHeight]="paginatorDropdownScrollHeight"
        [currentPageReportTemplate]="currentPageReportTemplate"
        [showFirstLastIcon]="showFirstLastIcon"
        [dropdownItemTemplate]="paginatorDropdownItemTemplate"
        [showCurrentPageReport]="showCurrentPageReport"
        [showJumpToPageDropdown]="showJumpToPageDropdown"
        [showJumpToPageInput]="showJumpToPageInput"
        [showPageLinks]="showPageLinks"
      ></p-paginator>

      <div
        #wrapper
        class="p-datatable-wrapper"
        [ngStyle]="{ height: scrollHeight }"
      >
        <table
          #table
          *ngIf="!virtualScroll"
          role="table"
          class="p-datatable-table"
          [ngClass]="tableStyleClass"
          [ngStyle]="tableStyle"
          [attr.id]="id + '-table'"
        >
          <ng-container
            *ngTemplateOutlet="
              colGroupTemplate;
              context: { $implicit: columns }
            "
          ></ng-container>
          <thead class="p-datatable-thead">
            <ng-container
              *ngTemplateOutlet="
                headerGroupedTemplate || headerTemplate;
                context: { $implicit: columns }
              "
            ></ng-container>
          </thead>
          <tbody
            class="p-datatable-tbody p-datatable-frozen-tbody"
            *ngIf="frozenValue || frozenBodyTemplate"
            [value]="frozenValue"
            [frozenRows]="true"
            [pTableBody]="columns"
            [pTableBodyTemplate]="frozenBodyTemplate"
            [frozen]="true"
          ></tbody>
          <tbody
            class="p-datatable-tbody"
            [value]="dataToRender"
            [pTableBody]="columns"
            [pTableBodyTemplate]="bodyTemplate"
          ></tbody>
          <tfoot
            *ngIf="footerGroupedTemplate || footerTemplate"
            class="p-datatable-tfoot"
          >
            <ng-container
              *ngTemplateOutlet="
                footerGroupedTemplate || footerTemplate;
                context: { $implicit: columns }
              "
            ></ng-container>
          </tfoot>
        </table>
        <cdk-virtual-scroll-viewport
          *ngIf="virtualScroll"
          [itemSize]="virtualRowHeight"
          tabindex="0"
          [style.height]="scrollHeight !== 'flex' ? scrollHeight : undefined"
          [minBufferPx]="minBufferPx"
          [maxBufferPx]="maxBufferPx"
          (scrolledIndexChange)="onScrollIndexChange($event)"
          class="p-datatable-virtual-scrollable-body"
        >
          <table
            #table
            role="table"
            class="p-datatable-table"
            [ngClass]="tableStyleClass"
            [ngStyle]="tableStyle"
            [attr.id]="id + '-table'"
          >
            <ng-container
              *ngTemplateOutlet="
                colGroupTemplate;
                context: { $implicit: columns }
              "
            ></ng-container>
            <thead #tableHeader class="p-datatable-thead">
              <ng-container
                *ngTemplateOutlet="
                  headerGroupedTemplate || headerTemplate;
                  context: { $implicit: columns }
                "
              ></ng-container>
            </thead>
            <tbody
              class="p-datatable-tbody p-datatable-frozen-tbody"
              *ngIf="frozenValue || frozenBodyTemplate"
              [value]="frozenValue"
              [frozenRows]="true"
              [pTableBody]="columns"
              [pTableBodyTemplate]="bodyTemplate"
              [frozen]="true"
            ></tbody>
            <tbody
              class="p-datatable-tbody"
              [value]="dataToRender"
              [pTableBody]="columns"
              [pTableBodyTemplate]="bodyTemplate"
            ></tbody>
            <tfoot
              *ngIf="footerGroupedTemplate || footerTemplate"
              class="p-datatable-tfoot"
            >
              <ng-container
                *ngTemplateOutlet="
                  footerGroupedTemplate || footerTemplate;
                  context: { $implicit: columns }
                "
              ></ng-container>
            </tfoot>
          </table>
        </cdk-virtual-scroll-viewport>
      </div>

      <p-paginator
        [rows]="rows"
        [first]="first"
        [totalRecords]="totalRecords"
        [pageLinkSize]="pageLinks"
        styleClass="p-paginator-bottom"
        [alwaysShow]="alwaysShowPaginator"
        (onPageChange)="onPageChange($event)"
        [rowsPerPageOptions]="rowsPerPageOptions"
        *ngIf="
          paginator &&
          (paginatorPosition === 'bottom' || paginatorPosition === 'both')
        "
        [templateLeft]="paginatorLeftTemplate"
        [templateRight]="paginatorRightTemplate"
        [dropdownAppendTo]="paginatorDropdownAppendTo"
        [dropdownScrollHeight]="paginatorDropdownScrollHeight"
        [currentPageReportTemplate]="currentPageReportTemplate"
        [showFirstLastIcon]="showFirstLastIcon"
        [dropdownItemTemplate]="paginatorDropdownItemTemplate"
        [showCurrentPageReport]="showCurrentPageReport"
        [showJumpToPageDropdown]="showJumpToPageDropdown"
        [showJumpToPageInput]="showJumpToPageInput"
        [showPageLinks]="showPageLinks"
      ></p-paginator>

      <div *ngIf="summaryTemplate" class="p-datatable-footer">
        <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
      </div>

      <div
        #resizeHelper
        class="p-column-resizer-helper"
        style="display:none"
        *ngIf="resizableColumns"
      ></div>
      <span
        #reorderIndicatorUp
        class="pi pi-arrow-down p-datatable-reorder-indicator-up"
        style="display:none"
        *ngIf="reorderableColumns"
      ></span>
      <span
        #reorderIndicatorDown
        class="pi pi-arrow-up p-datatable-reorder-indicator-down"
        style="display:none"
        *ngIf="reorderableColumns"
      ></span>
    </div>
  `,
  providers: [TableService],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./table.component.scss'],
})
export class Table
  implements OnInit, AfterViewInit, AfterContentInit, BlockableUI, OnChanges
{
  @Input() frozenColumns: any[];

  @Input() frozenValue: any[];

  @Input() style: any;

  @Input() styleClass: string;

  @Input() tableStyle: any;

  @Input() tableStyleClass: string;

  @Input() paginator: boolean;

  @Input() pageLinks: number = 5;

  @Input() rowsPerPageOptions: any[];

  @Input() alwaysShowPaginator: boolean = true;

  @Input() paginatorPosition: string = 'bottom';

  @Input() paginatorDropdownAppendTo: any;

  @Input() paginatorDropdownScrollHeight: string = '200px';

  @Input() currentPageReportTemplate: string = '{currentPage} of {totalPages}';

  @Input() showCurrentPageReport: boolean;

  @Input() showJumpToPageDropdown: boolean;

  @Input() showJumpToPageInput: boolean;

  @Input() showFirstLastIcon: boolean = true;

  @Input() showPageLinks: boolean = true;

  @Input() defaultSortOrder: number = 1;

  @Input() sortMode: string = 'single';

  @Input() resetPageOnSort: boolean = true;

  @Input() selectionMode: string;

  @Input() selectionPageOnly: boolean;

  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @Input() contextMenuSelection: any;

  @Output() contextMenuSelectionChange: EventEmitter<any> = new EventEmitter();

  @Input() contextMenuSelectionMode: string = 'separate';

  @Input() dataKey: string;

  @Input() metaKeySelection: boolean;

  @Input() rowSelectable;

  @Input() rowTrackBy: Function = (index: number, item: any) => item;

  @Input() lazy: boolean = false;

  @Input() lazyLoadOnInit: boolean = true;

  @Input() compareSelectionBy: string = 'deepEquals';

  @Input() csvSeparator: string = ',';

  @Input() exportFilename: string = 'download';

  @Input() filters: { [s: string]: FilterMetadata | FilterMetadata[] } = {};

  @Input() globalFilterFields: string[];

  @Input() filterDelay: number = 300;

  @Input() filterLocale: string;

  @Input() expandedRowKeys: { [s: string]: boolean } = {};

  @Input() editingRowKeys: { [s: string]: boolean } = {};

  @Input() rowExpandMode: string = 'multiple';

  @Input() scrollable: boolean;

  @Input() scrollDirection: string = 'vertical';

  @Input() rowGroupMode: string;

  @Input() scrollHeight: string;

  @Input() virtualScroll: boolean;

  @Input() virtualScrollDelay: number = 250;

  @Input() virtualRowHeight: number = 28;

  @Input() frozenWidth: string;

  @Input() responsive: boolean;

  @Input() contextMenu: any;

  @Input() resizableColumns: boolean;

  @Input() columnResizeMode: string = 'fit';

  @Input() reorderableColumns: boolean;

  @Input() loading: boolean;

  @Input() loadingIcon: string = 'pi pi-spinner';

  @Input() showLoader: boolean = true;

  @Input() rowHover: boolean;

  @Input() customSort: boolean;

  @Input() showInitialSortBadge: boolean = true;

  @Input() autoLayout: boolean;

  @Input() exportFunction;

  @Input() exportHeader: string;

  @Input() stateKey: string;

  @Input() stateStorage: string = 'session';

  @Input() editMode: string = 'cell';

  @Input() groupRowsBy: any;

  @Input() groupRowsByOrder: number = 1;

  @Input() minBufferPx: number;

  @Input() maxBufferPx: number;

  @Input() responsiveLayout: string = 'stack';

  @Input() breakpoint: string = '960px';

  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

  @Output() onPage: EventEmitter<any> = new EventEmitter();

  @Output() onSort: EventEmitter<any> = new EventEmitter();

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  @Output() onLazyLoad: EventEmitter<any> = new EventEmitter();

  @Output() onRowExpand: EventEmitter<any> = new EventEmitter();

  @Output() onRowCollapse: EventEmitter<any> = new EventEmitter();

  @Output() onContextMenuSelect: EventEmitter<any> = new EventEmitter();

  @Output() onColResize: EventEmitter<any> = new EventEmitter();

  @Output() onColReorder: EventEmitter<any> = new EventEmitter();

  @Output() onRowReorder: EventEmitter<any> = new EventEmitter();

  @Output() onEditInit: EventEmitter<any> = new EventEmitter();

  @Output() onEditComplete: EventEmitter<any> = new EventEmitter();

  @Output() onEditCancel: EventEmitter<any> = new EventEmitter();

  @Output() onHeaderCheckboxToggle: EventEmitter<any> = new EventEmitter();

  @Output() sortFunction: EventEmitter<any> = new EventEmitter();

  @Output() firstChange: EventEmitter<number> = new EventEmitter();

  @Output() rowsChange: EventEmitter<number> = new EventEmitter();

  @Output() onStateSave: EventEmitter<any> = new EventEmitter();

  @Output() onStateRestore: EventEmitter<any> = new EventEmitter();

  @ViewChild('container') containerViewChild: ElementRef;

  @ViewChild('resizeHelper') resizeHelperViewChild: ElementRef;

  @ViewChild('reorderIndicatorUp') reorderIndicatorUpViewChild: ElementRef;

  @ViewChild('reorderIndicatorDown') reorderIndicatorDownViewChild: ElementRef;

  @ViewChild('wrapper') wrapperViewChild: ElementRef;

  @ViewChild('table') tableViewChild: ElementRef;

  @ViewChild('tableHeader') tableHeaderViewChild: ElementRef;

  @ViewChild(CdkVirtualScrollViewport)
  virtualScrollBody: CdkVirtualScrollViewport;

  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  _value: any[] = [];

  _columns: any[];

  _totalRecords: number = 0;

  _first: number = 0;

  _rows: number;

  filteredValue: any[];

  headerTemplate: TemplateRef<any>;

  headerGroupedTemplate: TemplateRef<any>;

  bodyTemplate: TemplateRef<any>;

  loadingBodyTemplate: TemplateRef<any>;

  captionTemplate: TemplateRef<any>;

  frozenRowsTemplate: TemplateRef<any>;

  footerTemplate: TemplateRef<any>;

  footerGroupedTemplate: TemplateRef<any>;

  summaryTemplate: TemplateRef<any>;

  colGroupTemplate: TemplateRef<any>;

  expandedRowTemplate: TemplateRef<any>;

  groupHeaderTemplate: TemplateRef<any>;

  groupFooterTemplate: TemplateRef<any>;

  rowspanTemplate: TemplateRef<any>;

  frozenExpandedRowTemplate: TemplateRef<any>;

  frozenHeaderTemplate: TemplateRef<any>;

  frozenBodyTemplate: TemplateRef<any>;

  frozenFooterTemplate: TemplateRef<any>;

  frozenColGroupTemplate: TemplateRef<any>;

  emptyMessageTemplate: TemplateRef<any>;

  paginatorLeftTemplate: TemplateRef<any>;

  paginatorRightTemplate: TemplateRef<any>;

  paginatorDropdownItemTemplate: TemplateRef<any>;

  selectionKeys: any = {};

  lastResizerHelperX: number;

  reorderIconWidth: number;

  reorderIconHeight: number;

  draggedColumn: any;

  draggedRowIndex: number;

  droppedRowIndex: number;

  rowDragging: boolean;

  dropPosition: number;

  editingCell: Element;

  editingCellData: any;

  editingCellField: any;

  editingCellRowIndex: number;

  selfClick: boolean;

  documentEditListener: any;

  _multiSortMeta: SortMeta[];

  _sortField: string;

  _sortOrder: number = 1;

  preventSelectionSetterPropagation: boolean;

  _selection: any;

  _selectAll: boolean | null = null;

  anchorRowIndex: number;

  rangeRowIndex: number;

  filterTimeout: any;

  initialized: boolean;

  rowTouched: boolean;

  restoringSort: boolean;

  restoringFilter: boolean;

  stateRestored: boolean;

  columnOrderStateRestored: boolean;

  columnWidthsState: string;

  tableWidthState: string;

  overlaySubscription: Subscription;

  virtualScrollSubscription: Subscription;

  resizeColumnElement;

  columnResizing: boolean = false;

  rowGroupHeaderStyleObject: any = {};

  id: string = UniqueComponentId();

  styleElement: any;

  responsiveStyleElement: any;

  constructor(
    public el: ElementRef,
    public zone: NgZone,
    public tableService: TableService,
    public cd: ChangeDetectorRef,
    public filterService: FilterService,
    public overlayService: OverlayService
  ) {}

  ngOnInit() {
    if (this.lazy && this.lazyLoadOnInit) {
      if (!this.virtualScroll) {
        this.onLazyLoad.emit(this.createLazyLoadMetadata());
      }

      if (this.restoringFilter) {
        this.restoringFilter = false;
      }
    }

    if (this.responsiveLayout === 'stack' && !this.scrollable) {
      this.createResponsiveStyle();
    }

    this.initialized = true;
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'caption':
          this.captionTemplate = item.template;
          break;

        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'headergrouped':
          this.headerGroupedTemplate = item.template;
          break;

        case 'body':
          this.bodyTemplate = item.template;
          break;

        case 'loadingbody':
          this.loadingBodyTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        case 'footergrouped':
          this.footerGroupedTemplate = item.template;
          break;

        case 'summary':
          this.summaryTemplate = item.template;
          break;

        case 'colgroup':
          this.colGroupTemplate = item.template;
          break;

        case 'rowexpansion':
          this.expandedRowTemplate = item.template;
          break;

        case 'groupheader':
          this.groupHeaderTemplate = item.template;
          break;

        case 'rowspan':
          this.rowspanTemplate = item.template;
          break;

        case 'groupfooter':
          this.groupFooterTemplate = item.template;
          break;

        case 'frozenrows':
          this.frozenRowsTemplate = item.template;
          break;

        case 'frozenheader':
          this.frozenHeaderTemplate = item.template;
          break;

        case 'frozenbody':
          this.frozenBodyTemplate = item.template;
          break;

        case 'frozenfooter':
          this.frozenFooterTemplate = item.template;
          break;

        case 'frozencolgroup':
          this.frozenColGroupTemplate = item.template;
          break;

        case 'frozenrowexpansion':
          this.frozenExpandedRowTemplate = item.template;
          break;

        case 'emptymessage':
          this.emptyMessageTemplate = item.template;
          break;

        case 'paginatorleft':
          this.paginatorLeftTemplate = item.template;
          break;

        case 'paginatorright':
          this.paginatorRightTemplate = item.template;
          break;

        case 'paginatordropdownitem':
          this.paginatorDropdownItemTemplate = item.template;
          break;
      }
    });
  }

  ngAfterViewInit() {
    if (this.isStateful() && this.resizableColumns) {
      this.restoreColumnWidths();
    }

    if (this.scrollable && this.virtualScroll) {
      this.virtualScrollSubscription =
        this.virtualScrollBody.renderedRangeStream.subscribe((range) => {
          let top = range.start * this.virtualRowHeight * -1;
          this.tableHeaderViewChild.nativeElement.style.top = top + 'px';
        });
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.value) {
      if (this.isStateful() && !this.stateRestored) {
        this.restoreState();
      }

      this._value = simpleChange.value.currentValue;

      if (!this.lazy) {
        this.totalRecords = this._value ? this._value.length : 0;

        if (this.sortMode == 'single' && (this.sortField || this.groupRowsBy))
          this.sortSingle();
        else if (
          this.sortMode == 'multiple' &&
          (this.multiSortMeta || this.groupRowsBy)
        )
          this.sortMultiple();
        else if (this.hasFilter())
          //sort already filters
          this._filter();
      }

      this.tableService.onValueChange(simpleChange.value.currentValue);
    }

    if (simpleChange.columns) {
      this._columns = simpleChange.columns.currentValue;
      this.tableService.onColumnsChange(simpleChange.columns.currentValue);

      if (
        this._columns &&
        this.isStateful() &&
        this.reorderableColumns &&
        !this.columnOrderStateRestored
      ) {
        this.restoreColumnOrder();
      }
    }

    if (simpleChange.sortField) {
      this._sortField = simpleChange.sortField.currentValue;

      //avoid triggering lazy load prior to lazy initialization at onInit
      if (!this.lazy || this.initialized) {
        if (this.sortMode === 'single') {
          this.sortSingle();
        }
      }
    }

    if (simpleChange.groupRowsBy) {
      //avoid triggering lazy load prior to lazy initialization at onInit
      if (!this.lazy || this.initialized) {
        if (this.sortMode === 'single') {
          this.sortSingle();
        }
      }
    }

    if (simpleChange.sortOrder) {
      this._sortOrder = simpleChange.sortOrder.currentValue;

      //avoid triggering lazy load prior to lazy initialization at onInit
      if (!this.lazy || this.initialized) {
        if (this.sortMode === 'single') {
          this.sortSingle();
        }
      }
    }

    if (simpleChange.groupRowsByOrder) {
      //avoid triggering lazy load prior to lazy initialization at onInit
      if (!this.lazy || this.initialized) {
        if (this.sortMode === 'single') {
          this.sortSingle();
        }
      }
    }

    if (simpleChange.multiSortMeta) {
      this._multiSortMeta = simpleChange.multiSortMeta.currentValue;
      if (
        this.sortMode === 'multiple' &&
        (this.initialized || (!this.lazy && !this.virtualScroll))
      ) {
        this.sortMultiple();
      }
    }

    if (simpleChange.selection) {
      this._selection = simpleChange.selection.currentValue;

      if (!this.preventSelectionSetterPropagation) {
        this.updateSelectionKeys();
        this.tableService.onSelectionChange();
      }
      this.preventSelectionSetterPropagation = false;
    }

    if (simpleChange.selectAll) {
      this._selectAll = simpleChange.selectAll.currentValue;

      if (!this.preventSelectionSetterPropagation) {
        this.updateSelectionKeys();
        this.tableService.onSelectionChange();

        if (this.isStateful()) {
          this.saveState();
        }
      }
      this.preventSelectionSetterPropagation = false;
    }
  }

  @Input() get value(): any[] {
    return this._value;
  }
  set value(val: any[]) {
    this._value = val;
  }

  @Input() get columns(): any[] {
    return this._columns;
  }
  set columns(cols: any[]) {
    this._columns = cols;
  }

  @Input() get first(): number {
    return this._first;
  }
  set first(val: number) {
    this._first = val;
  }

  @Input() get rows(): number {
    return this._rows;
  }
  set rows(val: number) {
    this._rows = val;
  }

  @Input() get totalRecords(): number {
    return this._totalRecords;
  }
  set totalRecords(val: number) {
    this._totalRecords = val;
    this.tableService.onTotalRecordsChange(this._totalRecords);
  }

  @Input() get sortField(): string {
    return this._sortField;
  }

  set sortField(val: string) {
    this._sortField = val;
  }

  @Input() get sortOrder(): number {
    return this._sortOrder;
  }
  set sortOrder(val: number) {
    this._sortOrder = val;
  }

  @Input() get multiSortMeta(): SortMeta[] {
    return this._multiSortMeta;
  }

  set multiSortMeta(val: SortMeta[]) {
    this._multiSortMeta = val;
  }

  @Input() get selection(): any {
    return this._selection;
  }

  set selection(val: any) {
    this._selection = val;
  }

  @Input() get selectAll(): boolean | null {
    return this._selection;
  }

  set selectAll(val: boolean | null) {
    this._selection = val;
  }

  get dataToRender() {
    let data = this.filteredValue || this.value;
    return data
      ? this.paginator && !this.lazy
        ? data.slice(this.first, this.first + this.rows)
        : data
      : [];
  }

  updateSelectionKeys() {
    if (this.dataKey && this._selection) {
      this.selectionKeys = {};
      if (Array.isArray(this._selection)) {
        for (let data of this._selection) {
          this.selectionKeys[
            String(ObjectUtils.resolveFieldData(data, this.dataKey))
          ] = 1;
        }
      } else {
        this.selectionKeys[
          String(ObjectUtils.resolveFieldData(this._selection, this.dataKey))
        ] = 1;
      }
    }
  }

  onPageChange(event) {
    this.first = event.first;
    this.rows = event.rows;

    if (this.lazy) {
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    }

    this.onPage.emit({
      first: this.first,
      rows: this.rows,
    });

    this.firstChange.emit(this.first);
    this.rowsChange.emit(this.rows);
    this.tableService.onValueChange(this.value);

    if (this.isStateful()) {
      this.saveState();
    }

    this.anchorRowIndex = null;

    if (this.scrollable) {
      this.resetScrollTop();
    }
  }

  sort(event) {
    let originalEvent = event.originalEvent;

    if (this.sortMode === 'single') {
      this._sortOrder =
        this.sortField === event.field
          ? this.sortOrder * -1
          : this.defaultSortOrder;
      this._sortField = event.field;

      if (this.resetPageOnSort) {
        this._first = 0;
        this.firstChange.emit(this._first);

        if (this.scrollable) {
          this.resetScrollTop();
        }
      }

      this.sortSingle();
    }
    if (this.sortMode === 'multiple') {
      let metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      let sortMeta = this.getSortMeta(event.field);

      if (sortMeta) {
        if (!metaKey) {
          this._multiSortMeta = [
            { field: event.field, order: sortMeta.order * -1 },
          ];

          if (this.resetPageOnSort) {
            this._first = 0;
            this.firstChange.emit(this._first);

            if (this.scrollable) {
              this.resetScrollTop();
            }
          }
        } else {
          sortMeta.order = sortMeta.order * -1;
        }
      } else {
        if (!metaKey || !this.multiSortMeta) {
          this._multiSortMeta = [];

          if (this.resetPageOnSort) {
            this._first = 0;
            this.firstChange.emit(this._first);
          }
        }
        this._multiSortMeta.push({
          field: event.field,
          order: this.defaultSortOrder,
        });
      }

      this.sortMultiple();
    }

    if (this.isStateful()) {
      this.saveState();
    }

    this.anchorRowIndex = null;
  }

  sortSingle() {
    let field = this.sortField || this.groupRowsBy;
    let order = this.sortField ? this.sortOrder : this.groupRowsByOrder;
    if (
      this.groupRowsBy &&
      this.sortField &&
      this.groupRowsBy !== this.sortField
    ) {
      this._multiSortMeta = [
        this.getGroupRowsMeta(),
        { field: this.sortField, order: this.sortOrder },
      ];
      this.sortMultiple();
      return;
    }

    if (field && order) {
      if (this.restoringSort) {
        this.restoringSort = false;
      }

      if (this.lazy) {
        this.onLazyLoad.emit(this.createLazyLoadMetadata());
      } else if (this.value) {
        if (this.customSort) {
          this.sortFunction.emit({
            data: this.value,
            mode: this.sortMode,
            field: field,
            order: order,
          });
        } else {
          this.value.sort((data1, data2) => {
            let value1 = ObjectUtils.resolveFieldData(data1, field);
            let value2 = ObjectUtils.resolveFieldData(data2, field);
            let result = null;

            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string')
              result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return order * result;
          });

          this._value = [...this.value];
        }

        if (this.hasFilter()) {
          this._filter();
        }
      }

      let sortMeta: SortMeta = {
        field: field,
        order: order,
      };

      this.onSort.emit(sortMeta);
      this.tableService.onSort(sortMeta);
    }
  }

  sortMultiple() {
    if (this.groupRowsBy) {
      if (!this._multiSortMeta) this._multiSortMeta = [this.getGroupRowsMeta()];
      else if (this.multiSortMeta[0].field !== this.groupRowsBy)
        this._multiSortMeta = [this.getGroupRowsMeta(), ...this._multiSortMeta];
    }

    if (this.multiSortMeta) {
      if (this.lazy) {
        this.onLazyLoad.emit(this.createLazyLoadMetadata());
      } else if (this.value) {
        if (this.customSort) {
          this.sortFunction.emit({
            data: this.value,
            mode: this.sortMode,
            multiSortMeta: this.multiSortMeta,
          });
        } else {
          this.value.sort((data1, data2) => {
            return this.multisortField(data1, data2, this.multiSortMeta, 0);
          });

          this._value = [...this.value];
        }

        if (this.hasFilter()) {
          this._filter();
        }
      }

      this.onSort.emit({
        multisortmeta: this.multiSortMeta,
      });
      this.tableService.onSort(this.multiSortMeta);
    }
  }

  multisortField(data1, data2, multiSortMeta, index) {
    let value1 = ObjectUtils.resolveFieldData(
      data1,
      multiSortMeta[index].field
    );
    let value2 = ObjectUtils.resolveFieldData(
      data2,
      multiSortMeta[index].field
    );
    let result = null;

    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 == 'string' || value1 instanceof String) {
      if (value1.localeCompare && value1 != value2) {
        return multiSortMeta[index].order * value1.localeCompare(value2);
      }
    } else {
      result = value1 < value2 ? -1 : 1;
    }

    if (value1 == value2) {
      return multiSortMeta.length - 1 > index
        ? this.multisortField(data1, data2, multiSortMeta, index + 1)
        : 0;
    }

    return multiSortMeta[index].order * result;
  }

  getSortMeta(field: string) {
    if (this.multiSortMeta && this.multiSortMeta.length) {
      for (let i = 0; i < this.multiSortMeta.length; i++) {
        if (this.multiSortMeta[i].field === field) {
          return this.multiSortMeta[i];
        }
      }
    }

    return null;
  }

  isSorted(field: string) {
    if (this.sortMode === 'single') {
      return this.sortField && this.sortField === field;
    } else if (this.sortMode === 'multiple') {
      let sorted = false;
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field == field) {
            sorted = true;
            break;
          }
        }
      }
      return sorted;
    }
  }

  handleRowClick(event) {
    let target = <HTMLElement>event.originalEvent.target;
    let targetNode = target.nodeName;
    let parentNode = target.parentElement && target.parentElement.nodeName;
    if (
      targetNode == 'INPUT' ||
      targetNode == 'BUTTON' ||
      targetNode == 'A' ||
      parentNode == 'INPUT' ||
      parentNode == 'BUTTON' ||
      parentNode == 'A' ||
      DomHandler.hasClass(event.originalEvent.target, 'p-clickable')
    ) {
      return;
    }

    if (this.selectionMode) {
      let rowData = event.rowData;
      let rowIndex = event.rowIndex;

      this.preventSelectionSetterPropagation = true;
      if (
        this.isMultipleSelectionMode() &&
        event.originalEvent.shiftKey &&
        this.anchorRowIndex != null
      ) {
        DomHandler.clearSelection();
        if (this.rangeRowIndex != null) {
          this.clearSelectionRange(event.originalEvent);
        }

        this.rangeRowIndex = rowIndex;
        this.selectRange(event.originalEvent, rowIndex);
      } else {
        let selected = this.isSelected(rowData);

        if (!selected && !this.isRowSelectable(rowData, rowIndex)) {
          return;
        }

        let metaSelection = this.rowTouched ? false : this.metaKeySelection;
        let dataKeyValue = this.dataKey
          ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
          : null;
        this.anchorRowIndex = rowIndex;
        this.rangeRowIndex = rowIndex;

        if (metaSelection) {
          let metaKey =
            event.originalEvent.metaKey || event.originalEvent.ctrlKey;

          if (selected && metaKey) {
            if (this.isSingleSelectionMode()) {
              this._selection = null;
              this.selectionKeys = {};
              this.selectionChange.emit(null);
            } else {
              let selectionIndex = this.findIndexInSelection(rowData);
              this._selection = this.selection.filter(
                (val, i) => i != selectionIndex
              );
              this.selectionChange.emit(this.selection);
              if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
              }
            }

            this.onRowUnselect.emit({
              originalEvent: event.originalEvent,
              data: rowData,
              type: 'row',
            });
          } else {
            if (this.isSingleSelectionMode()) {
              this._selection = rowData;
              this.selectionChange.emit(rowData);
              if (dataKeyValue) {
                this.selectionKeys = {};
                this.selectionKeys[dataKeyValue] = 1;
              }
            } else if (this.isMultipleSelectionMode()) {
              if (metaKey) {
                this._selection = this.selection || [];
              } else {
                this._selection = [];
                this.selectionKeys = {};
              }

              this._selection = [...this.selection, rowData];
              this.selectionChange.emit(this.selection);
              if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
              }
            }

            this.onRowSelect.emit({
              originalEvent: event.originalEvent,
              data: rowData,
              type: 'row',
              index: rowIndex,
            });
          }
        } else {
          if (this.selectionMode === 'single') {
            if (selected) {
              this._selection = null;
              this.selectionKeys = {};
              this.selectionChange.emit(this.selection);
              this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row',
                index: rowIndex,
              });
            } else {
              this._selection = rowData;
              this.selectionChange.emit(this.selection);
              this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row',
                index: rowIndex,
              });
              if (dataKeyValue) {
                this.selectionKeys = {};
                this.selectionKeys[dataKeyValue] = 1;
              }
            }
          } else if (this.selectionMode === 'multiple') {
            if (selected) {
              let selectionIndex = this.findIndexInSelection(rowData);
              this._selection = this.selection.filter(
                (val, i) => i != selectionIndex
              );
              this.selectionChange.emit(this.selection);
              this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row',
                index: rowIndex,
              });
              if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
              }
            } else {
              this._selection = this.selection
                ? [...this.selection, rowData]
                : [rowData];
              this.selectionChange.emit(this.selection);
              this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row',
                index: rowIndex,
              });
              if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
              }
            }
          }
        }
      }

      this.tableService.onSelectionChange();

      if (this.isStateful()) {
        this.saveState();
      }
    }

    this.rowTouched = false;
  }

  handleRowTouchEnd(event) {
    this.rowTouched = true;
  }

  handleRowRightClick(event) {
    if (this.contextMenu) {
      const rowData = event.rowData;
      const rowIndex = event.rowIndex;

      if (this.contextMenuSelectionMode === 'separate') {
        this.contextMenuSelection = rowData;
        this.contextMenuSelectionChange.emit(rowData);
        this.onContextMenuSelect.emit({
          originalEvent: event.originalEvent,
          data: rowData,
          index: event.rowIndex,
        });
        this.contextMenu.show(event.originalEvent);
        this.tableService.onContextMenu(rowData);
      } else if (this.contextMenuSelectionMode === 'joint') {
        this.preventSelectionSetterPropagation = true;
        let selected = this.isSelected(rowData);
        let dataKeyValue = this.dataKey
          ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
          : null;

        if (!selected) {
          if (!this.isRowSelectable(rowData, rowIndex)) {
            return;
          }

          if (this.isSingleSelectionMode()) {
            this.selection = rowData;
            this.selectionChange.emit(rowData);

            if (dataKeyValue) {
              this.selectionKeys = {};
              this.selectionKeys[dataKeyValue] = 1;
            }
          } else if (this.isMultipleSelectionMode()) {
            this._selection = this.selection
              ? [...this.selection, rowData]
              : [rowData];
            this.selectionChange.emit(this.selection);

            if (dataKeyValue) {
              this.selectionKeys[dataKeyValue] = 1;
            }
          }
        }

        this.tableService.onSelectionChange();
        this.contextMenu.show(event.originalEvent);
        this.onContextMenuSelect.emit({
          originalEvent: event,
          data: rowData,
          index: event.rowIndex,
        });
      }
    }
  }

  selectRange(event: MouseEvent, rowIndex: number) {
    let rangeStart, rangeEnd;

    if (this.anchorRowIndex > rowIndex) {
      rangeStart = rowIndex;
      rangeEnd = this.anchorRowIndex;
    } else if (this.anchorRowIndex < rowIndex) {
      rangeStart = this.anchorRowIndex;
      rangeEnd = rowIndex;
    } else {
      rangeStart = rowIndex;
      rangeEnd = rowIndex;
    }

    if (this.lazy && this.paginator) {
      rangeStart -= this.first;
      rangeEnd -= this.first;
    }

    let rangeRowsData = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
      let rangeRowData = this.filteredValue
        ? this.filteredValue[i]
        : this.value[i];
      if (!this.isSelected(rangeRowData)) {
        if (!this.isRowSelectable(rangeRowData, rowIndex)) {
          continue;
        }

        rangeRowsData.push(rangeRowData);
        this._selection = [...this.selection, rangeRowData];
        let dataKeyValue: string = this.dataKey
          ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey))
          : null;
        if (dataKeyValue) {
          this.selectionKeys[dataKeyValue] = 1;
        }
      }
    }
    this.selectionChange.emit(this.selection);
    this.onRowSelect.emit({
      originalEvent: event,
      data: rangeRowsData,
      type: 'row',
    });
  }

  clearSelectionRange(event: MouseEvent) {
    let rangeStart, rangeEnd;

    if (this.rangeRowIndex > this.anchorRowIndex) {
      rangeStart = this.anchorRowIndex;
      rangeEnd = this.rangeRowIndex;
    } else if (this.rangeRowIndex < this.anchorRowIndex) {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.anchorRowIndex;
    } else {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.rangeRowIndex;
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      let rangeRowData = this.value[i];
      let selectionIndex = this.findIndexInSelection(rangeRowData);
      this._selection = this.selection.filter((val, i) => i != selectionIndex);
      let dataKeyValue: string = this.dataKey
        ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey))
        : null;
      if (dataKeyValue) {
        delete this.selectionKeys[dataKeyValue];
      }
      this.onRowUnselect.emit({
        originalEvent: event,
        data: rangeRowData,
        type: 'row',
      });
    }
  }

  isSelected(rowData) {
    if (rowData && this.selection) {
      if (this.dataKey) {
        return (
          this.selectionKeys[
            ObjectUtils.resolveFieldData(rowData, this.dataKey)
          ] !== undefined
        );
      } else {
        if (this.selection instanceof Array)
          return this.findIndexInSelection(rowData) > -1;
        else return this.equals(rowData, this.selection);
      }
    }

    return false;
  }

  findIndexInSelection(rowData: any) {
    let index: number = -1;
    if (this.selection && this.selection.length) {
      for (let i = 0; i < this.selection.length; i++) {
        if (this.equals(rowData, this.selection[i])) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  isRowSelectable(data, index) {
    if (this.rowSelectable && !this.rowSelectable({ data, index })) {
      return false;
    }

    return true;
  }

  toggleRowWithRadio(event: any, rowData: any) {
    this.preventSelectionSetterPropagation = true;

    if (this.selection != rowData) {
      if (!this.isRowSelectable(rowData, event.rowIndex)) {
        return;
      }

      this._selection = rowData;
      this.selectionChange.emit(this.selection);
      this.onRowSelect.emit({
        originalEvent: event.originalEvent,
        index: event.rowIndex,
        data: rowData,
        type: 'radiobutton',
      });

      if (this.dataKey) {
        this.selectionKeys = {};
        this.selectionKeys[
          String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
        ] = 1;
      }
    } else {
      this._selection = null;
      this.selectionChange.emit(this.selection);
      this.onRowUnselect.emit({
        originalEvent: event.originalEvent,
        index: event.rowIndex,
        data: rowData,
        type: 'radiobutton',
      });
    }

    this.tableService.onSelectionChange();

    if (this.isStateful()) {
      this.saveState();
    }
  }

  toggleRowWithCheckbox(event, rowData: any) {
    this.selection = this.selection || [];
    let selected = this.isSelected(rowData);
    let dataKeyValue = this.dataKey
      ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
      : null;
    this.preventSelectionSetterPropagation = true;

    if (selected) {
      let selectionIndex = this.findIndexInSelection(rowData);
      this._selection = this.selection.filter((val, i) => i != selectionIndex);
      this.selectionChange.emit(this.selection);
      this.onRowUnselect.emit({
        originalEvent: event.originalEvent,
        index: event.rowIndex,
        data: rowData,
        type: 'checkbox',
      });
      if (dataKeyValue) {
        delete this.selectionKeys[dataKeyValue];
      }
    } else {
      if (!this.isRowSelectable(rowData, event.rowIndex)) {
        return;
      }

      this._selection = this.selection
        ? [...this.selection, rowData]
        : [rowData];
      this.selectionChange.emit(this.selection);
      this.onRowSelect.emit({
        originalEvent: event.originalEvent,
        index: event.rowIndex,
        data: rowData,
        type: 'checkbox',
      });
      if (dataKeyValue) {
        this.selectionKeys[dataKeyValue] = 1;
      }
    }

    this.tableService.onSelectionChange();

    if (this.isStateful()) {
      this.saveState();
    }
  }

  toggleRowsWithCheckbox(event: Event, check: boolean) {
    if (this._selectAll !== null) {
      this.selectAllChange.emit({ originalEvent: event, checked: check });
    } else {
      const data = this.selectionPageOnly
        ? this.dataToRender
        : this.filteredValue || this.value || [];
      let selection =
        this.selectionPageOnly && this._selection
          ? this._selection.filter((s) => !data.some((d) => this.equals(s, d)))
          : [];

      if (check) {
        selection = this.frozenValue
          ? [...selection, ...this.frozenValue, ...data]
          : [...selection, ...data];
        selection = this.rowSelectable
          ? selection.filter((data, index) =>
              this.rowSelectable({ data, index })
            )
          : selection;
      }

      this._selection = selection;
      this.preventSelectionSetterPropagation = true;
      this.updateSelectionKeys();
      this.selectionChange.emit(this._selection);
      this.tableService.onSelectionChange();
      this.onHeaderCheckboxToggle.emit({
        originalEvent: event,
        checked: check,
      });

      if (this.isStateful()) {
        this.saveState();
      }
    }
  }

  equals(data1, data2) {
    return this.compareSelectionBy === 'equals'
      ? data1 === data2
      : ObjectUtils.equals(data1, data2, this.dataKey);
  }

  /* Legacy Filtering for custom elements */
  filter(value: any, field: string, matchMode: string) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    if (!this.isFilterBlank(value)) {
      this.filters[field] = { value: value, matchMode: matchMode };
    } else if (this.filters[field]) {
      delete this.filters[field];
    }

    this.filterTimeout = setTimeout(() => {
      this._filter();
      this.filterTimeout = null;
    }, this.filterDelay);

    this.anchorRowIndex = null;
  }

  filterGlobal(value, matchMode) {
    this.filter(value, 'global', matchMode);
  }

  isFilterBlank(filter: any): boolean {
    if (filter !== null && filter !== undefined) {
      if (
        (typeof filter === 'string' && filter.trim().length == 0) ||
        (filter instanceof Array && filter.length == 0)
      )
        return true;
      else return false;
    }
    return true;
  }

  _filter() {
    if (!this.restoringFilter) {
      this.first = 0;
      this.firstChange.emit(this.first);
    }

    if (this.lazy) {
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    } else {
      if (!this.value) {
        return;
      }

      if (!this.hasFilter()) {
        this.filteredValue = null;
        if (this.paginator) {
          this.totalRecords = this.value ? this.value.length : 0;
        }
      } else {
        let globalFilterFieldsArray;
        if (this.filters['global']) {
          if (!this.columns && !this.globalFilterFields)
            throw new Error(
              'Global filtering requires dynamic columns or globalFilterFields to be defined.'
            );
          else
            globalFilterFieldsArray = this.globalFilterFields || this.columns;
        }

        this.filteredValue = [];

        for (let i = 0; i < this.value.length; i++) {
          let localMatch = true;
          let globalMatch = false;
          let localFiltered = false;

          for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop) && prop !== 'global') {
              localFiltered = true;
              let filterField = prop;
              let filterMeta = this.filters[filterField];

              if (Array.isArray(filterMeta)) {
                for (let meta of filterMeta) {
                  localMatch = this.executeLocalFilter(
                    filterField,
                    this.value[i],
                    meta
                  );

                  if (
                    (meta.operator === FilterOperator.OR && localMatch) ||
                    (meta.operator === FilterOperator.AND && !localMatch)
                  ) {
                    break;
                  }
                }
              } else {
                localMatch = this.executeLocalFilter(
                  filterField,
                  this.value[i],
                  filterMeta
                );
              }

              if (!localMatch) {
                break;
              }
            }
          }

          if (
            this.filters['global'] &&
            !globalMatch &&
            globalFilterFieldsArray
          ) {
            for (let j = 0; j < globalFilterFieldsArray.length; j++) {
              let globalFilterField =
                globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
              globalMatch = this.filterService.filters[
                (<FilterMetadata>this.filters['global']).matchMode
              ](
                ObjectUtils.resolveFieldData(this.value[i], globalFilterField),
                (<FilterMetadata>this.filters['global']).value,
                this.filterLocale
              );

              if (globalMatch) {
                break;
              }
            }
          }

          let matches: boolean;
          if (this.filters['global']) {
            matches = localFiltered
              ? localFiltered && localMatch && globalMatch
              : globalMatch;
          } else {
            matches = localFiltered && localMatch;
          }

          if (matches) {
            this.filteredValue.push(this.value[i]);
          }
        }

        if (this.filteredValue.length === this.value.length) {
          this.filteredValue = null;
        }

        if (this.paginator) {
          this.totalRecords = this.filteredValue
            ? this.filteredValue.length
            : this.value
            ? this.value.length
            : 0;
        }
      }
    }

    this.onFilter.emit({
      filters: this.filters,
      filteredValue: this.filteredValue || this.value,
    });

    this.tableService.onValueChange(this.value);

    if (this.isStateful() && !this.restoringFilter) {
      this.saveState();
    }

    if (this.restoringFilter) {
      this.restoringFilter = false;
    }

    this.cd.markForCheck();

    if (this.scrollable) {
      this.resetScrollTop();
    }
  }

  executeLocalFilter(
    field: string,
    rowData: any,
    filterMeta: FilterMetadata
  ): boolean {
    let filterValue = filterMeta.value;
    let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
    let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
    let filterConstraint = this.filterService.filters[filterMatchMode];

    return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
  }

  hasFilter() {
    let empty = true;
    for (let prop in this.filters) {
      if (this.filters.hasOwnProperty(prop)) {
        empty = false;
        break;
      }
    }

    return !empty;
  }

  createLazyLoadMetadata(): any {
    return {
      first: this.first,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters,
      globalFilter:
        this.filters && this.filters['global']
          ? (<FilterMetadata>this.filters['global']).value
          : null,
      multiSortMeta: this.multiSortMeta,
    };
  }

  public clear() {
    this._sortField = null;
    this._sortOrder = this.defaultSortOrder;
    this._multiSortMeta = null;
    this.tableService.onSort(null);

    if (this.filters['global']) {
      (<FilterMetadata>this.filters['global']).value = null;
    }

    this.filteredValue = null;
    this.tableService.onResetChange();

    this.first = 0;
    this.firstChange.emit(this.first);

    if (this.lazy) {
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    } else {
      this.totalRecords = this._value ? this._value.length : 0;
    }
  }

  public reset() {
    this.clear();
  }

  getExportHeader(column) {
    return column[this.exportHeader] || column.header || column.field;
  }

  public exportCSV(options?: any) {
    let data;
    let csv = '';
    let columns = this.columns;

    if (options && options.selectionOnly) {
      data = this.selection || [];
    } else {
      data = this.filteredValue || this.value;

      if (this.frozenValue) {
        data = data ? [...this.frozenValue, ...data] : this.frozenValue;
      }
    }

    //headers
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      if (column.exportable !== false && column.field) {
        csv += '"' + this.getExportHeader(column) + '"';

        if (i < columns.length - 1) {
          csv += this.csvSeparator;
        }
      }
    }

    //body
    data.forEach((record, i) => {
      csv += '\n';
      for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (column.exportable !== false && column.field) {
          let cellData = ObjectUtils.resolveFieldData(record, column.field);

          if (cellData != null) {
            if (this.exportFunction) {
              cellData = this.exportFunction({
                data: cellData,
                field: column.field,
              });
            } else cellData = String(cellData).replace(/"/g, '""');
          } else cellData = '';

          csv += '"' + cellData + '"';

          if (i < columns.length - 1) {
            csv += this.csvSeparator;
          }
        }
      }
    });

    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    let link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    if (link.download !== undefined) {
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', this.exportFilename + '.csv');
      link.click();
    } else {
      csv = 'data:text/csv;charset=utf-8,' + csv;
      window.open(encodeURI(csv));
    }
    document.body.removeChild(link);
  }

  public resetScrollTop() {
    if (this.virtualScroll) this.scrollToVirtualIndex(0);
    else this.scrollTo({ top: 0 });
  }

  public scrollToVirtualIndex(index: number) {
    if (this.virtualScrollBody) {
      this.virtualScrollBody.scrollToIndex(index);
    }
  }

  virtualScrollTimeout: any;

  virtualPage: number;

  virtualScrollInitialized: boolean = false;

  onScrollIndexChange(index: number) {
    if (this.lazy) {
      if (this.virtualScrollTimeout) {
        clearTimeout(this.virtualScrollTimeout);
      }

      this.virtualScrollTimeout = setTimeout(() => {
        let page = Math.floor(index / this.rows);
        let virtualScrollOffset = page === 0 ? 0 : (page - 1) * this.rows;
        let virtualScrollChunkSize = page === 0 ? this.rows * 2 : this.rows * 3;

        if (page !== this.virtualPage) {
          this.virtualPage = page;

          if (this.lazyLoadOnInit || this.virtualScrollInitialized) {
            this.onLazyLoad.emit({
              first: virtualScrollOffset,
              rows: virtualScrollChunkSize,
              sortField: this.sortField,
              sortOrder: this.sortOrder,
              filters: this.filters,
              globalFilter:
                this.filters && this.filters['global']
                  ? (<FilterMetadata>this.filters['global']).value
                  : null,
              multiSortMeta: this.multiSortMeta,
            });
          } else {
            this.virtualScrollInitialized = true;
          }
        }
      }, this.virtualScrollDelay);
    }
  }

  public scrollTo(options) {
    if (this.virtualScrollBody) {
      this.virtualScrollBody.scrollTo(options);
    } else if (this.wrapperViewChild && this.wrapperViewChild.nativeElement) {
      if (this.wrapperViewChild.nativeElement.scrollTo) {
        this.wrapperViewChild.nativeElement.scrollTo(options);
      } else {
        this.wrapperViewChild.nativeElement.scrollLeft = options.left;
        this.wrapperViewChild.nativeElement.scrollTop = options.top;
      }
    }
  }

  updateEditingCell(cell, data, field, index) {
    this.editingCell = cell;
    this.editingCellData = data;
    this.editingCellField = field;
    this.editingCellRowIndex = index;
    this.bindDocumentEditListener();
  }

  isEditingCellValid() {
    return (
      this.editingCell &&
      DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0
    );
  }

  bindDocumentEditListener() {
    if (!this.documentEditListener) {
      this.documentEditListener = (event) => {
        if (this.editingCell && !this.selfClick && this.isEditingCellValid()) {
          DomHandler.removeClass(this.editingCell, 'p-cell-editing');
          this.editingCell = null;
          this.onEditComplete.emit({
            field: this.editingCellField,
            data: this.editingCellData,
            originalEvent: event,
            index: this.editingCellRowIndex,
          });
          this.editingCellField = null;
          this.editingCellData = null;
          this.editingCellRowIndex = null;
          this.unbindDocumentEditListener();
          this.cd.markForCheck();

          if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
          }
        }

        this.selfClick = false;
      };

      document.addEventListener('click', this.documentEditListener);
    }
  }

  unbindDocumentEditListener() {
    if (this.documentEditListener) {
      document.removeEventListener('click', this.documentEditListener);
      this.documentEditListener = null;
    }
  }

  initRowEdit(rowData: any) {
    let dataKeyValue = String(
      ObjectUtils.resolveFieldData(rowData, this.dataKey)
    );
    this.editingRowKeys[dataKeyValue] = true;
  }

  saveRowEdit(rowData: any, rowElement: HTMLTableRowElement) {
    if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
      let dataKeyValue = String(
        ObjectUtils.resolveFieldData(rowData, this.dataKey)
      );
      delete this.editingRowKeys[dataKeyValue];
    }
  }

  cancelRowEdit(rowData: any) {
    let dataKeyValue = String(
      ObjectUtils.resolveFieldData(rowData, this.dataKey)
    );
    delete this.editingRowKeys[dataKeyValue];
  }

  toggleRow(rowData: any, event?: Event) {
    if (!this.dataKey) {
      throw new Error('dataKey must be defined to use row expansion');
    }

    let dataKeyValue = String(
      ObjectUtils.resolveFieldData(rowData, this.dataKey)
    );

    if (this.expandedRowKeys[dataKeyValue] != null) {
      delete this.expandedRowKeys[dataKeyValue];
      this.onRowCollapse.emit({
        originalEvent: event,
        data: rowData,
      });
    } else {
      if (this.rowExpandMode === 'single') {
        this.expandedRowKeys = {};
      }

      this.expandedRowKeys[dataKeyValue] = true;
      this.onRowExpand.emit({
        originalEvent: event,
        data: rowData,
      });
    }

    if (event) {
      event.preventDefault();
    }

    if (this.isStateful()) {
      this.saveState();
    }
  }

  isRowExpanded(rowData: any): boolean {
    return (
      this.expandedRowKeys[
        String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
      ] === true
    );
  }

  isRowEditing(rowData: any): boolean {
    return (
      this.editingRowKeys[
        String(ObjectUtils.resolveFieldData(rowData, this.dataKey))
      ] === true
    );
  }

  isSingleSelectionMode() {
    return this.selectionMode === 'single';
  }

  isMultipleSelectionMode() {
    return this.selectionMode === 'multiple';
  }

  onColumnResizeBegin(event) {
    let containerLeft = DomHandler.getOffset(
      this.containerViewChild.nativeElement
    ).left;
    this.resizeColumnElement = event.target.parentElement;
    this.columnResizing = true;
    this.lastResizerHelperX =
      event.pageX -
      containerLeft +
      this.containerViewChild.nativeElement.scrollLeft;
    this.onColumnResize(event);
    event.preventDefault();
  }

  onColumnResize(event) {
    let containerLeft = DomHandler.getOffset(
      this.containerViewChild.nativeElement
    ).left;
    DomHandler.addClass(
      this.containerViewChild.nativeElement,
      'p-unselectable-text'
    );
    this.resizeHelperViewChild.nativeElement.style.height =
      this.containerViewChild.nativeElement.offsetHeight + 'px';
    this.resizeHelperViewChild.nativeElement.style.top = 0 + 'px';
    this.resizeHelperViewChild.nativeElement.style.left =
      event.pageX -
      containerLeft +
      this.containerViewChild.nativeElement.scrollLeft +
      'px';

    this.resizeHelperViewChild.nativeElement.style.display = 'block';
  }

  onColumnResizeEnd() {
    let delta =
      this.resizeHelperViewChild.nativeElement.offsetLeft -
      this.lastResizerHelperX;
    let columnWidth = this.resizeColumnElement.offsetWidth;
    let newColumnWidth = columnWidth + delta;
    let minWidth = this.resizeColumnElement.style.minWidth || 15;

    if (newColumnWidth >= minWidth) {
      if (this.columnResizeMode === 'fit') {
        let nextColumn = this.resizeColumnElement.nextElementSibling;
        let nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15 && nextColumnWidth > 15) {
          this.resizeTableCells(newColumnWidth, nextColumnWidth);
        }
      } else if (this.columnResizeMode === 'expand') {
        let tableWidth = this.tableViewChild.nativeElement.offsetWidth + delta;
        this.tableViewChild.nativeElement.style.width = tableWidth + 'px';
        this.tableViewChild.nativeElement.style.minWidth = tableWidth + 'px';

        this.resizeTableCells(newColumnWidth, null);
      }

      this.onColResize.emit({
        element: this.resizeColumnElement,
        delta: delta,
      });

      if (this.isStateful()) {
        this.saveState();
      }
    }

    this.resizeHelperViewChild.nativeElement.style.display = 'none';
    DomHandler.removeClass(
      this.containerViewChild.nativeElement,
      'p-unselectable-text'
    );
  }

  resizeTableCells(newColumnWidth, nextColumnWidth) {
    let colIndex = DomHandler.index(this.resizeColumnElement);
    let widths = [];
    const tableHead = DomHandler.findSingle(
      this.containerViewChild.nativeElement,
      '.p-datatable-thead'
    );
    let headers = DomHandler.find(tableHead, 'tr > th');
    headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));

    this.destroyStyleElement();
    this.createStyleElement();

    let innerHTML = '';
    widths.forEach((width, index) => {
      let colWidth =
        index === colIndex
          ? newColumnWidth
          : nextColumnWidth && index === colIndex + 1
          ? nextColumnWidth
          : width;
      let style = this.scrollable
        ? `flex: 1 1 ${colWidth}px !important`
        : `width: ${colWidth}px !important`;
      innerHTML += `
              #${this.id} .p-datatable-thead > tr > th:nth-child(${index + 1}),
              #${this.id} .p-datatable-tbody > tr > td:nth-child(${index + 1}),
              #${this.id} .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                  ${style}
              }
          `;
    });

    this.styleElement.innerHTML = innerHTML;
  }

  onColumnDragStart(event, columnElement) {
    this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(
      this.reorderIndicatorUpViewChild.nativeElement
    );
    this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(
      this.reorderIndicatorDownViewChild.nativeElement
    );
    this.draggedColumn = columnElement;
    event.dataTransfer.setData('text', 'b'); // For firefox
  }

  onColumnDragEnter(event, dropHeader) {
    if (this.reorderableColumns && this.draggedColumn && dropHeader) {
      event.preventDefault();
      let containerOffset = DomHandler.getOffset(
        this.containerViewChild.nativeElement
      );
      let dropHeaderOffset = DomHandler.getOffset(dropHeader);

      if (this.draggedColumn != dropHeader) {
        let dragIndex = DomHandler.indexWithinGroup(
          this.draggedColumn,
          'preorderablecolumn'
        );
        let dropIndex = DomHandler.indexWithinGroup(
          dropHeader,
          'preorderablecolumn'
        );
        let targetLeft = dropHeaderOffset.left - containerOffset.left;
        let targetTop = containerOffset.top - dropHeaderOffset.top;
        let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

        this.reorderIndicatorUpViewChild.nativeElement.style.top =
          dropHeaderOffset.top -
          containerOffset.top -
          (this.reorderIconHeight - 1) +
          'px';
        this.reorderIndicatorDownViewChild.nativeElement.style.top =
          dropHeaderOffset.top -
          containerOffset.top +
          dropHeader.offsetHeight +
          'px';

        if (event.pageX > columnCenter) {
          this.reorderIndicatorUpViewChild.nativeElement.style.left =
            targetLeft +
            dropHeader.offsetWidth -
            Math.ceil(this.reorderIconWidth / 2) +
            'px';
          this.reorderIndicatorDownViewChild.nativeElement.style.left =
            targetLeft +
            dropHeader.offsetWidth -
            Math.ceil(this.reorderIconWidth / 2) +
            'px';
          this.dropPosition = 1;
        } else {
          this.reorderIndicatorUpViewChild.nativeElement.style.left =
            targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
          this.reorderIndicatorDownViewChild.nativeElement.style.left =
            targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
          this.dropPosition = -1;
        }

        if (
          (dropIndex - dragIndex === 1 && this.dropPosition === -1) ||
          (dropIndex - dragIndex === -1 && this.dropPosition === 1)
        ) {
          this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
          this.reorderIndicatorDownViewChild.nativeElement.style.display =
            'none';
        } else {
          this.reorderIndicatorUpViewChild.nativeElement.style.display =
            'block';
          this.reorderIndicatorDownViewChild.nativeElement.style.display =
            'block';
        }
      } else {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onColumnDragLeave(event) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
      this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
    }
  }

  onColumnDrop(event, dropColumn) {
    event.preventDefault();
    if (this.draggedColumn) {
      let dragIndex = DomHandler.indexWithinGroup(
        this.draggedColumn,
        'preorderablecolumn'
      );
      let dropIndex = DomHandler.indexWithinGroup(
        dropColumn,
        'preorderablecolumn'
      );
      let allowDrop = dragIndex != dropIndex;
      if (
        allowDrop &&
        ((dropIndex - dragIndex == 1 && this.dropPosition === -1) ||
          (dragIndex - dropIndex == 1 && this.dropPosition === 1))
      ) {
        allowDrop = false;
      }

      if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
        dropIndex = dropIndex + 1;
      }

      if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
        dropIndex = dropIndex - 1;
      }

      if (allowDrop) {
        ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);

        this.onColReorder.emit({
          dragIndex: dragIndex,
          dropIndex: dropIndex,
          columns: this.columns,
        });

        if (this.isStateful()) {
          this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              this.saveState();
            });
          });
        }
      }

      this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
      this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
      this.draggedColumn.draggable = false;
      this.draggedColumn = null;
      this.dropPosition = null;
    }
  }

  onRowDragStart(event, index) {
    this.rowDragging = true;
    this.draggedRowIndex = index;
    event.dataTransfer.setData('text', 'b'); // For firefox
  }

  onRowDragOver(event, index, rowElement) {
    if (this.rowDragging && this.draggedRowIndex !== index) {
      let rowY =
        DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
      let pageY = event.pageY;
      let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
      let prevRowElement = rowElement.previousElementSibling;

      if (pageY < rowMidY) {
        DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

        this.droppedRowIndex = index;
        if (prevRowElement)
          DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        else DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
      } else {
        if (prevRowElement)
          DomHandler.removeClass(
            prevRowElement,
            'p-datatable-dragpoint-bottom'
          );
        else DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');

        this.droppedRowIndex = index + 1;
        DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
      }
    }
  }

  onRowDragLeave(event, rowElement) {
    let prevRowElement = rowElement.previousElementSibling;
    if (prevRowElement) {
      DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
    }

    DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
    DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
  }

  onRowDragEnd(event) {
    this.rowDragging = false;
    this.draggedRowIndex = null;
    this.droppedRowIndex = null;
  }

  onRowDrop(event, rowElement) {
    if (this.droppedRowIndex != null) {
      let dropIndex =
        this.draggedRowIndex > this.droppedRowIndex
          ? this.droppedRowIndex
          : this.droppedRowIndex === 0
          ? 0
          : this.droppedRowIndex - 1;
      ObjectUtils.reorderArray(this.value, this.draggedRowIndex, dropIndex);

      this.onRowReorder.emit({
        dragIndex: this.draggedRowIndex,
        dropIndex: dropIndex,
      });
    }
    //cleanup
    this.onRowDragLeave(event, rowElement);
    this.onRowDragEnd(event);
  }

  isEmpty() {
    let data = this.filteredValue || this.value;
    return data == null || data.length == 0;
  }

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }

  getStorage() {
    switch (this.stateStorage) {
      case 'local':
        return window.localStorage;

      case 'session':
        return window.sessionStorage;

      default:
        throw new Error(
          this.stateStorage +
            ' is not a valid value for the state storage, supported values are "local" and "session".'
        );
    }
  }

  isStateful() {
    return this.stateKey != null;
  }

  saveState() {
    const storage = this.getStorage();
    let state: TableState = {};

    if (this.paginator) {
      state.first = this.first;
      state.rows = this.rows;
    }

    if (this.sortField) {
      state.sortField = this.sortField;
      state.sortOrder = this.sortOrder;
    }

    if (this.multiSortMeta) {
      state.multiSortMeta = this.multiSortMeta;
    }

    if (this.hasFilter()) {
      state.filters = this.filters;
    }

    if (this.resizableColumns) {
      this.saveColumnWidths(state);
    }

    if (this.reorderableColumns) {
      this.saveColumnOrder(state);
    }

    if (this.selection) {
      state.selection = this.selection;
    }

    if (Object.keys(this.expandedRowKeys).length) {
      state.expandedRowKeys = this.expandedRowKeys;
    }

    storage.setItem(this.stateKey, JSON.stringify(state));
    this.onStateSave.emit(state);
  }

  clearState() {
    const storage = this.getStorage();

    if (this.stateKey) {
      storage.removeItem(this.stateKey);
    }
  }

  restoreState() {
    const storage = this.getStorage();
    const stateString = storage.getItem(this.stateKey);
    const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
    const reviver = function (key, value) {
      if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
      }

      return value;
    };

    if (stateString) {
      let state: TableState = JSON.parse(stateString, reviver);

      if (this.paginator) {
        if (this.first !== undefined) {
          this.first = state.first;
          this.firstChange.emit(this.first);
        }

        if (this.rows !== undefined) {
          this.rows = state.rows;
          this.rowsChange.emit(this.rows);
        }
      }

      if (state.sortField) {
        this.restoringSort = true;
        this._sortField = state.sortField;
        this._sortOrder = state.sortOrder;
      }

      if (state.multiSortMeta) {
        this.restoringSort = true;
        this._multiSortMeta = state.multiSortMeta;
      }

      if (state.filters) {
        this.restoringFilter = true;
        this.filters = state.filters;
      }

      if (this.resizableColumns) {
        this.columnWidthsState = state.columnWidths;
        this.tableWidthState = state.tableWidth;
      }

      if (state.expandedRowKeys) {
        this.expandedRowKeys = state.expandedRowKeys;
      }

      if (state.selection) {
        Promise.resolve(null).then(() =>
          this.selectionChange.emit(state.selection)
        );
      }

      this.stateRestored = true;

      this.onStateRestore.emit(state);
    }
  }

  saveColumnWidths(state) {
    let widths = [];
    let headers = DomHandler.find(
      this.containerViewChild.nativeElement,
      '.p-datatable-thead > tr > th'
    );
    headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
    state.columnWidths = widths.join(',');

    if (this.columnResizeMode === 'expand') {
      state.tableWidth =
        DomHandler.getOuterWidth(this.tableViewChild.nativeElement) + 'px';
    }
  }

  restoreColumnWidths() {
    if (this.columnWidthsState) {
      let widths = this.columnWidthsState.split(',');

      if (this.columnResizeMode === 'expand' && this.tableWidthState) {
        this.tableViewChild.nativeElement.style.width = this.tableWidthState;
        this.tableViewChild.nativeElement.style.minWidth = this.tableWidthState;
        this.containerViewChild.nativeElement.style.width =
          this.tableWidthState;
      }

      if (ObjectUtils.isNotEmpty(widths)) {
        this.createStyleElement();

        let innerHTML = '';
        widths.forEach((width, index) => {
          let style = this.scrollable
            ? `flex: 1 1 ${width}px !important`
            : `width: ${width}px !important`;

          innerHTML += `
                      #${this.id} .p-datatable-thead > tr > th:nth-child(${
            index + 1
          }),
                      #${this.id} .p-datatable-tbody > tr > td:nth-child(${
            index + 1
          }),
                      #${this.id} .p-datatable-tfoot > tr > td:nth-child(${
            index + 1
          }) {
                          ${style}
                      }
                  `;
        });

        this.styleElement.innerHTML = innerHTML;
      }
    }
  }

  saveColumnOrder(state) {
    if (this.columns) {
      let columnOrder: string[] = [];
      this.columns.map((column) => {
        columnOrder.push(column.field || column.key);
      });

      state.columnOrder = columnOrder;
    }
  }

  restoreColumnOrder() {
    const storage = this.getStorage();
    const stateString = storage.getItem(this.stateKey);
    if (stateString) {
      let state: TableState = JSON.parse(stateString);
      let columnOrder = state.columnOrder;
      if (columnOrder) {
        let reorderedColumns = [];

        columnOrder.map((key) => {
          let col = this.findColumnByKey(key);
          if (col) {
            reorderedColumns.push(col);
          }
        });
        this.columnOrderStateRestored = true;
        this.columns = reorderedColumns;
      }
    }
  }

  findColumnByKey(key) {
    if (this.columns) {
      for (let col of this.columns) {
        if (col.key === key || col.field === key) return col;
        else continue;
      }
    } else {
      return null;
    }
  }

  createStyleElement() {
    this.styleElement = document.createElement('style');
    this.styleElement.type = 'text/css';
    document.head.appendChild(this.styleElement);
  }

  getGroupRowsMeta() {
    return { field: this.groupRowsBy, order: this.groupRowsByOrder };
  }

  createResponsiveStyle() {
    if (!this.responsiveStyleElement) {
      this.responsiveStyleElement = document.createElement('style');
      this.responsiveStyleElement.type = 'text/css';
      document.head.appendChild(this.responsiveStyleElement);

      let innerHTML = `
@media screen and (max-width: ${this.breakpoint}) {
  #${this.id} .p-datatable-thead > tr > th,
  #${this.id} .p-datatable-tfoot > tr > td {
      display: none !important;
  }

  #${this.id} .p-datatable-tbody > tr > td {
      display: flex;
      width: 100% !important;
      align-items: center;
      justify-content: space-between;
  }

  #${this.id} .p-datatable-tbody > tr > td:not(:last-child) {
      border: 0 none;
  }

  #${this.id}.p-datatable-gridlines .p-datatable-tbody > tr > td:last-child {
      border-top: 0;
      border-right: 0;
      border-left: 0;
  }

  #${this.id} .p-datatable-tbody > tr > td > .p-column-title {
      display: block;
  }
}
`;

      this.responsiveStyleElement.innerHTML = innerHTML;
    }
  }

  destroyResponsiveStyle() {
    if (this.responsiveStyleElement) {
      document.head.removeChild(this.responsiveStyleElement);
      this.responsiveStyleElement = null;
    }
  }

  destroyStyleElement() {
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  ngOnDestroy() {
    this.unbindDocumentEditListener();
    this.editingCell = null;
    this.initialized = null;
    this.virtualScrollInitialized = null;

    if (this.virtualScrollSubscription) {
      this.virtualScrollSubscription.unsubscribe();
    }

    this.destroyStyleElement();
    this.destroyResponsiveStyle();
  }
}
