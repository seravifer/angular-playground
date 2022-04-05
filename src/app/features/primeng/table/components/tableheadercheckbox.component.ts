import {
  Component,
  Input,
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
  selector: 'p-tableHeaderCheckbox',
  template: `
    <div
      class="p-checkbox p-component"
      [ngClass]="{
        'p-checkbox-focused': focused,
        'p-checkbox-disabled': isDisabled()
      }"
      (click)="onClick($event)"
    >
      <div class="p-hidden-accessible">
        <input
          #cb
          type="checkbox"
          [attr.id]="inputId"
          [attr.name]="name"
          [checked]="checked"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [disabled]="isDisabled()"
          [attr.aria-label]="ariaLabel"
        />
      </div>
      <div
        #box
        [ngClass]="{
          'p-checkbox-box': true,
          'p-highlight': checked,
          'p-focus': focused,
          'p-disabled': isDisabled()
        }"
        role="checkbox"
        [attr.aria-checked]="checked"
      >
        <span
          class="p-checkbox-icon"
          [ngClass]="{ 'pi pi-check': checked }"
        ></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableHeaderCheckbox {
  @Input() disabled: boolean;

  @Input() inputId: string;

  @Input() name: string;

  @Input() ariaLabel: string;

  checked: boolean;

  focused: boolean;

  selectionChangeSubscription: Subscription;

  valueChangeSubscription: Subscription;

  constructor(
    public dt: Table,
    public tableService: TableService,
    public cd: ChangeDetectorRef
  ) {
    this.valueChangeSubscription = this.dt.tableService.valueSource$.subscribe(
      () => {
        this.checked = this.updateCheckedState();
      }
    );

    this.selectionChangeSubscription =
      this.dt.tableService.selectionSource$.subscribe(() => {
        this.checked = this.updateCheckedState();
      });
  }

  ngOnInit() {
    this.checked = this.updateCheckedState();
  }

  onClick(event: Event) {
    if (!this.disabled) {
      if (this.dt.value && this.dt.value.length > 0) {
        this.dt.toggleRowsWithCheckbox(event, !this.checked);
      }
    }

    DomHandler.clearSelection();
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
  }

  isDisabled() {
    return this.disabled || !this.dt.value || !this.dt.value.length;
  }

  ngOnDestroy() {
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }

    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  updateCheckedState() {
    this.cd.markForCheck();

    if (this.dt._selectAll !== null) {
      return this.dt._selectAll;
    } else {
      const data = this.dt.selectionPageOnly
        ? this.dt.dataToRender
        : this.dt.filteredValue || this.dt.value || [];
      const val = this.dt.frozenValue
        ? [...this.dt.frozenValue, ...data]
        : data;
      const selectableVal = this.dt.rowSelectable
        ? val.filter((data, index) => this.dt.rowSelectable({ data, index }))
        : val;

      return (
        ObjectUtils.isNotEmpty(selectableVal) &&
        ObjectUtils.isNotEmpty(this.dt.selection) &&
        selectableVal.every((v) =>
          this.dt.selection.some((s) => this.dt.equals(v, s))
        )
      );
    }
  }
}
