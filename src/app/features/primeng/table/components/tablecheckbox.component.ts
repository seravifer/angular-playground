import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { Subscription } from 'rxjs';
import { TableService } from '../table.service';
import { Table } from '../table.component';

@Component({
  selector: 'p-tableCheckbox',
  template: `
    <div
      class="p-checkbox p-component"
      [ngClass]="{
        'p-checkbox-focused': focused,
        'p-checkbox-disabled': disabled
      }"
      (click)="onClick($event)"
    >
      <div class="p-hidden-accessible">
        <input
          type="checkbox"
          [attr.id]="inputId"
          [attr.name]="name"
          [checked]="checked"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [disabled]="disabled"
          [attr.required]="required"
          [attr.aria-label]="ariaLabel"
        />
      </div>
      <div
        #box
        [ngClass]="{
          'p-checkbox-box p-component': true,
          'p-highlight': checked,
          'p-focus': focused,
          'p-disabled': disabled
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
export class TableCheckbox {
  @Input() disabled: boolean;

  @Input() value: any;

  @Input() index: number;

  @Input() inputId: string;

  @Input() name: string;

  @Input() required: boolean;

  @Input() ariaLabel: string;

  checked: boolean;

  focused: boolean;

  subscription: Subscription;

  constructor(
    public dt: Table,
    public tableService: TableService,
    public cd: ChangeDetectorRef
  ) {
    this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
      this.checked = this.dt.isSelected(this.value);
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.checked = this.dt.isSelected(this.value);
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.dt.toggleRowWithCheckbox(
        {
          originalEvent: event,
          rowIndex: this.index,
        },
        this.value
      );
    }
    DomHandler.clearSelection();
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
