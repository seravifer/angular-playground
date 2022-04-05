/* eslint-disable */
import {
  Component,
  AfterContentInit,
  Input,
  ElementRef,
  ContentChildren,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  Renderer2,
} from '@angular/core';
import {
  PrimeTemplate,
  FilterMatchMode,
  FilterOperator,
  SelectItem,
  PrimeNGConfig,
  TranslationKeys,
  OverlayService,
} from 'primeng/api';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import { FilterMetadata } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  trigger,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { Table } from '../table.component';

@Component({
  selector: 'p-columnFilter',
  template: `
    <div
      class="p-column-filter"
      [ngClass]="{
        'p-column-filter-row': display === 'row',
        'p-column-filter-menu': display === 'menu'
      }"
    >
      <p-columnFilterFormElement
        *ngIf="display === 'row'"
        class="p-fluid"
        [type]="type"
        [field]="field"
        [filterConstraint]="dt.filters[field]"
        [filterTemplate]="filterTemplate"
        [placeholder]="placeholder"
        [minFractionDigits]="minFractionDigits"
        [maxFractionDigits]="maxFractionDigits"
        [prefix]="prefix"
        [suffix]="suffix"
        [locale]="locale"
        [localeMatcher]="localeMatcher"
        [currency]="currency"
        [currencyDisplay]="currencyDisplay"
        [useGrouping]="useGrouping"
      ></p-columnFilterFormElement>
      <button
        #icon
        *ngIf="showMenuButton"
        type="button"
        class="p-column-filter-menu-button p-link"
        aria-haspopup="true"
        [attr.aria-expanded]="overlayVisible"
        [ngClass]="{
          'p-column-filter-menu-button-open': overlayVisible,
          'p-column-filter-menu-button-active': hasFilter()
        }"
        (click)="toggleMenu()"
        (keydown)="onToggleButtonKeyDown($event)"
      >
        <span class="pi pi-filter-icon pi-filter"></span>
      </button>
      <button
        #icon
        *ngIf="showClearButton && display === 'row'"
        [ngClass]="{ 'p-hidden-space': !hasRowFilter() }"
        type="button"
        class="p-column-filter-clear-button p-link"
        (click)="clearFilter()"
      >
        <span class="pi pi-filter-slash"></span>
      </button>
      <div
        *ngIf="showMenu && overlayVisible"
        [ngClass]="{
          'p-column-filter-overlay p-component p-fluid': true,
          'p-column-filter-overlay-menu': display === 'menu'
        }"
        (click)="onContentClick()"
        [@overlayAnimation]="'visible'"
        (@overlayAnimation.start)="onOverlayAnimationStart($event)"
        (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
        (keydown.escape)="onEscape()"
      >
        <ng-container
          *ngTemplateOutlet="headerTemplate; context: { $implicit: field }"
        ></ng-container>
        <ul
          *ngIf="display === 'row'; else menu"
          class="p-column-filter-row-items"
        >
          <li
            class="p-column-filter-row-item"
            *ngFor="let matchMode of matchModes; let i = index"
            (click)="onRowMatchModeChange(matchMode.value)"
            (keydown)="onRowMatchModeKeyDown($event)"
            (keydown.enter)="this.onRowMatchModeChange(matchMode.value)"
            [ngClass]="{
              'p-highlight': isRowMatchModeSelected(matchMode.value)
            }"
            [attr.tabindex]="i === 0 ? '0' : null"
          >
            {{ matchMode.label }}
          </li>
          <li class="p-column-filter-separator"></li>
          <li
            class="p-column-filter-row-item"
            (click)="onRowClearItemClick()"
            (keydown)="onRowMatchModeKeyDown($event)"
            (keydown.enter)="onRowClearItemClick()"
          >
            {{ noFilterLabel }}
          </li>
        </ul>
        <ng-template #menu>
          <div class="p-column-filter-operator" *ngIf="isShowOperator">
            <p-dropdown
              [options]="operatorOptions"
              [ngModel]="operator"
              (ngModelChange)="onOperatorChange($event)"
              styleClass="p-column-filter-operator-dropdown"
            ></p-dropdown>
          </div>
          <div class="p-column-filter-constraints">
            <div
              *ngFor="let fieldConstraint of fieldConstraints; let i = index"
              class="p-column-filter-constraint"
            >
              <p-dropdown
                *ngIf="showMatchModes && matchModes"
                [options]="matchModes"
                [ngModel]="fieldConstraint.matchMode"
                (ngModelChange)="onMenuMatchModeChange($event, fieldConstraint)"
                styleClass="p-column-filter-matchmode-dropdown"
              ></p-dropdown>
              <p-columnFilterFormElement
                [type]="type"
                [field]="field"
                [filterConstraint]="fieldConstraint"
                [filterTemplate]="filterTemplate"
                [placeholder]="placeholder"
                [minFractionDigits]="minFractionDigits"
                [maxFractionDigits]="maxFractionDigits"
                [prefix]="prefix"
                [suffix]="suffix"
                [locale]="locale"
                [localeMatcher]="localeMatcher"
                [currency]="currency"
                [currencyDisplay]="currencyDisplay"
                [useGrouping]="useGrouping"
              ></p-columnFilterFormElement>
              <div>
                <button
                  *ngIf="showRemoveIcon"
                  type="button"
                  pButton
                  icon="pi pi-trash"
                  class="p-column-filter-remove-button p-button-text p-button-danger p-button-sm"
                  (click)="removeConstraint(fieldConstraint)"
                  pRipple
                  [label]="removeRuleButtonLabel"
                ></button>
              </div>
            </div>
          </div>
          <div class="p-column-filter-add-rule" *ngIf="isShowAddConstraint">
            <button
              type="button"
              pButton
              [label]="addRuleButtonLabel"
              icon="pi pi-plus"
              class="p-column-filter-add-button p-button-text p-button-sm"
              (click)="addConstraint()"
              pRipple
            ></button>
          </div>
          <div class="p-column-filter-buttonbar">
            <button
              *ngIf="showClearButton"
              type="button"
              pButton
              class="p-button-outlined p-button-sm"
              (click)="clearFilter()"
              [label]="clearButtonLabel"
              pRipple
            ></button>
            <button
              *ngIf="showApplyButton"
              type="button"
              pButton
              (click)="applyFilter()"
              class="p-button-sm"
              [label]="applyButtonLabel"
              pRipple
            ></button>
          </div>
        </ng-template>
        <ng-container
          *ngTemplateOutlet="footerTemplate; context: { $implicit: field }"
        ></ng-container>
      </div>
    </div>
  `,
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)'),
      ]),
      transition(':leave', [animate('.1s linear', style({ opacity: 0 }))]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnFilter implements AfterContentInit {
  @Input() field: string;

  @Input() type: string = 'text';

  @Input() display: string = 'row';

  @Input() showMenu: boolean = true;

  @Input() matchMode: string;

  @Input() operator: string = FilterOperator.AND;

  @Input() showOperator: boolean = true;

  @Input() showClearButton: boolean = true;

  @Input() showApplyButton: boolean = true;

  @Input() showMatchModes: boolean = true;

  @Input() showAddButton: boolean = true;

  @Input() hideOnClear: boolean = false;

  @Input() placeholder: string;

  @Input() matchModeOptions: SelectItem[];

  @Input() maxConstraints: number = 2;

  @Input() minFractionDigits: number;

  @Input() maxFractionDigits: number;

  @Input() prefix: string;

  @Input() suffix: string;

  @Input() locale: string;

  @Input() localeMatcher: string;

  @Input() currency: string;

  @Input() currencyDisplay: string;

  @Input() useGrouping: boolean = true;

  @ViewChild('icon') icon: ElementRef;

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  constructor(
    public el: ElementRef,
    public dt: Table,
    public renderer: Renderer2,
    public config: PrimeNGConfig,
    public overlayService: OverlayService
  ) {}

  overlaySubscription: Subscription;

  headerTemplate: TemplateRef<any>;

  filterTemplate: TemplateRef<any>;

  footerTemplate: TemplateRef<any>;

  operatorOptions: any[];

  overlayVisible: boolean;

  overlay: HTMLElement;

  scrollHandler: any;

  documentClickListener: any;

  documentResizeListener: any;

  matchModes: SelectItem[];

  translationSubscription: Subscription;

  resetSubscription: Subscription;

  selfClick: boolean;

  overlayEventListener;

  ngOnInit() {
    if (!this.dt.filters[this.field]) {
      this.initFieldFilterConstraint();
    }

    this.translationSubscription = this.config.translationObserver.subscribe(
      () => {
        this.generateMatchModeOptions();
        this.generateOperatorOptions();
      }
    );

    this.resetSubscription = this.dt.tableService.resetSource$.subscribe(() => {
      this.initFieldFilterConstraint();
    });

    this.generateMatchModeOptions();
    this.generateOperatorOptions();
  }

  generateMatchModeOptions() {
    this.matchModes =
      this.matchModeOptions ||
      this.config.filterMatchModeOptions[this.type]?.map((key) => {
        return { label: this.config.getTranslation(key), value: key };
      });
  }

  generateOperatorOptions() {
    this.operatorOptions = [
      {
        label: this.config.getTranslation(TranslationKeys.MATCH_ALL),
        value: FilterOperator.AND,
      },
      {
        label: this.config.getTranslation(TranslationKeys.MATCH_ANY),
        value: FilterOperator.OR,
      },
    ];
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'filter':
          this.filterTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        default:
          this.filterTemplate = item.template;
          break;
      }
    });
  }

  initFieldFilterConstraint() {
    let defaultMatchMode = this.getDefaultMatchMode();
    this.dt.filters[this.field] =
      this.display == 'row'
        ? { value: null, matchMode: defaultMatchMode }
        : [
            {
              value: null,
              matchMode: defaultMatchMode,
              operator: this.operator,
            },
          ];
  }

  onMenuMatchModeChange(value: any, filterMeta: FilterMetadata) {
    filterMeta.matchMode = value;

    if (!this.showApplyButton) {
      this.dt._filter();
    }
  }

  onRowMatchModeChange(matchMode: string) {
    (<FilterMetadata>this.dt.filters[this.field]).matchMode = matchMode;
    this.dt._filter();
    this.hide();
  }

  onRowMatchModeKeyDown(event: KeyboardEvent) {
    let item = <HTMLLIElement>event.target;

    switch (event.key) {
      case 'ArrowDown':
        var nextItem = this.findNextItem(item);
        if (nextItem) {
          item.removeAttribute('tabindex');
          nextItem.tabIndex = '0';
          nextItem.focus();
        }

        event.preventDefault();
        break;

      case 'ArrowUp':
        var prevItem = this.findPrevItem(item);
        if (prevItem) {
          item.removeAttribute('tabindex');
          prevItem.tabIndex = '0';
          prevItem.focus();
        }

        event.preventDefault();
        break;
    }
  }

  onRowClearItemClick() {
    this.clearFilter();
    this.hide();
  }

  isRowMatchModeSelected(matchMode: string) {
    return (
      (<FilterMetadata>this.dt.filters[this.field]).matchMode === matchMode
    );
  }

  addConstraint() {
    (<FilterMetadata[]>this.dt.filters[this.field]).push({
      value: null,
      matchMode: this.getDefaultMatchMode(),
      operator: this.getDefaultOperator(),
    });
    this.dt._filter();
  }

  removeConstraint(filterMeta: FilterMetadata) {
    this.dt.filters[this.field] = (<FilterMetadata[]>(
      this.dt.filters[this.field]
    )).filter((meta) => meta !== filterMeta);
    this.dt._filter();
  }

  onOperatorChange(value) {
    (<FilterMetadata[]>this.dt.filters[this.field]).forEach((filterMeta) => {
      filterMeta.operator = value;
      this.operator = value;
    });

    if (!this.showApplyButton) {
      this.dt._filter();
    }
  }

  toggleMenu() {
    this.overlayVisible = !this.overlayVisible;
  }

  onToggleButtonKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
      case 'Tab':
        this.overlayVisible = false;
        break;

      case 'ArrowDown':
        if (this.overlayVisible) {
          let focusable = DomHandler.getFocusableElements(this.overlay);
          if (focusable) {
            focusable[0].focus();
          }
          event.preventDefault();
        } else if (event.altKey) {
          this.overlayVisible = true;
          event.preventDefault();
        }
        break;
    }
  }

  onEscape() {
    this.overlayVisible = false;
    this.icon.nativeElement.focus();
  }

  findNextItem(item: HTMLLIElement) {
    let nextItem = <HTMLLIElement>item.nextElementSibling;

    if (nextItem)
      return DomHandler.hasClass(nextItem, 'p-column-filter-separator')
        ? this.findNextItem(nextItem)
        : nextItem;
    else return item.parentElement.firstElementChild;
  }

  findPrevItem(item: HTMLLIElement) {
    let prevItem = <HTMLLIElement>item.previousElementSibling;

    if (prevItem)
      return DomHandler.hasClass(prevItem, 'p-column-filter-separator')
        ? this.findPrevItem(prevItem)
        : prevItem;
    else return item.parentElement.lastElementChild;
  }

  onContentClick() {
    this.selfClick = true;
  }

  onOverlayAnimationStart(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.overlay = event.element;

        document.body.appendChild(this.overlay);
        ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
        DomHandler.absolutePosition(this.overlay, this.icon.nativeElement);
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        this.overlayEventListener = (e) => {
          if (this.overlay && this.overlay.contains(e.target)) {
            this.selfClick = true;
          }
        };

        this.overlaySubscription =
          this.overlayService.clickObservable.subscribe(
            this.overlayEventListener
          );
        break;

      case 'void':
        this.onOverlayHide();

        if (this.overlaySubscription) {
          this.overlaySubscription.unsubscribe();
        }
        break;
    }
  }

  onOverlayAnimationEnd(event: AnimationEvent) {
    switch (event.toState) {
      case 'void':
        ZIndexUtils.clear(event.element);
        break;
    }
  }

  getDefaultMatchMode(): string {
    if (this.matchMode) {
      return this.matchMode;
    } else {
      if (this.type === 'text') return FilterMatchMode.STARTS_WITH;
      else if (this.type === 'numeric') return FilterMatchMode.EQUALS;
      else if (this.type === 'date') return FilterMatchMode.DATE_IS;
      else return FilterMatchMode.CONTAINS;
    }
  }

  getDefaultOperator(): string {
    return this.dt.filters
      ? (<FilterMetadata[]>this.dt.filters[this.field])[0].operator
      : this.operator;
  }

  hasRowFilter() {
    return (
      this.dt.filters[this.field] &&
      !this.dt.isFilterBlank(
        (<FilterMetadata>this.dt.filters[this.field]).value
      )
    );
  }

  get fieldConstraints(): FilterMetadata[] {
    return this.dt.filters
      ? <FilterMetadata[]>this.dt.filters[this.field]
      : null;
  }

  get showRemoveIcon(): boolean {
    return this.fieldConstraints ? this.fieldConstraints.length > 1 : false;
  }

  get showMenuButton(): boolean {
    return (
      this.showMenu && (this.display === 'row' ? this.type !== 'boolean' : true)
    );
  }

  get isShowOperator(): boolean {
    return this.showOperator && this.type !== 'boolean';
  }

  get isShowAddConstraint(): boolean {
    return (
      this.showAddButton &&
      this.type !== 'boolean' &&
      this.fieldConstraints &&
      this.fieldConstraints.length < this.maxConstraints
    );
  }

  get applyButtonLabel(): string {
    return this.config.getTranslation(TranslationKeys.APPLY);
  }

  get clearButtonLabel(): string {
    return this.config.getTranslation(TranslationKeys.CLEAR);
  }

  get addRuleButtonLabel(): string {
    return this.config.getTranslation(TranslationKeys.ADD_RULE);
  }

  get removeRuleButtonLabel(): string {
    return this.config.getTranslation(TranslationKeys.REMOVE_RULE);
  }

  get noFilterLabel(): string {
    return this.config.getTranslation(TranslationKeys.NO_FILTER);
  }

  hasFilter(): boolean {
    let fieldFilter = this.dt.filters[this.field];
    if (fieldFilter) {
      if (Array.isArray(fieldFilter))
        return !this.dt.isFilterBlank((<FilterMetadata[]>fieldFilter)[0].value);
      else return !this.dt.isFilterBlank(fieldFilter.value);
    }

    return false;
  }

  isOutsideClicked(event): boolean {
    return !(
      this.overlay.isSameNode(event.target) ||
      this.overlay.contains(event.target) ||
      this.icon.nativeElement.isSameNode(event.target) ||
      this.icon.nativeElement.contains(event.target) ||
      DomHandler.hasClass(event.target, 'p-column-filter-add-button') ||
      DomHandler.hasClass(
        event.target.parentElement,
        'p-column-filter-add-button'
      ) ||
      DomHandler.hasClass(event.target, 'p-column-filter-remove-button') ||
      DomHandler.hasClass(
        event.target.parentElement,
        'p-column-filter-remove-button'
      )
    );
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      const documentTarget: any = this.el
        ? this.el.nativeElement.ownerDocument
        : 'document';

      this.documentClickListener = this.renderer.listen(
        documentTarget,
        'mousedown',
        (event) => {
          if (
            this.overlayVisible &&
            !this.selfClick &&
            this.isOutsideClicked(event)
          ) {
            this.hide();
          }

          this.selfClick = false;
        }
      );
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
      this.selfClick = false;
    }
  }

  bindDocumentResizeListener() {
    this.documentResizeListener = () => this.hide();
    window.addEventListener('resize', this.documentResizeListener);
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  bindScrollListener() {
    if (!this.scrollHandler) {
      this.scrollHandler = new ConnectedOverlayScrollHandler(
        this.icon.nativeElement,
        () => {
          if (this.overlayVisible) {
            this.hide();
          }
        }
      );
    }

    this.scrollHandler.bindScrollListener();
  }

  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }

  hide() {
    this.overlayVisible = false;
  }

  onOverlayHide() {
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
    this.unbindScrollListener();
    this.overlay = null;
  }

  clearFilter() {
    this.initFieldFilterConstraint();
    this.dt._filter();
    if (this.hideOnClear) this.hide();
  }

  applyFilter() {
    this.dt._filter();
    this.hide();
  }

  ngOnDestroy() {
    if (this.overlay) {
      this.el.nativeElement.appendChild(this.overlay);
      ZIndexUtils.clear(this.overlay);
      this.onOverlayHide();
    }

    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }

    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }

    if (this.overlaySubscription) {
      this.overlaySubscription.unsubscribe();
    }
  }
}
