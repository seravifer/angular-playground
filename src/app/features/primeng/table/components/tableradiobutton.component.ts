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
  selector: 'p-tableRadioButton',
  template: `
    <div
      class="p-radiobutton p-component"
      [ngClass]="{
        'p-radiobutton-focused': focused,
        'p-radiobutton-disabled': disabled
      }"
      (click)="onClick($event)"
    >
      <div class="p-hidden-accessible">
        <input
          type="radio"
          [attr.id]="inputId"
          [attr.name]="name"
          [checked]="checked"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel"
        />
      </div>
      <div
        #box
        [ngClass]="{
          'p-radiobutton-box p-component': true,
          'p-highlight': checked,
          'p-focus': focused,
          'p-disabled': disabled
        }"
        role="radio"
        [attr.aria-checked]="checked"
      >
        <div class="p-radiobutton-icon"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableRadioButton {
  @Input() disabled: boolean;

  @Input() value: any;

  @Input() index: number;

  @Input() inputId: string;

  @Input() name: string;

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
      this.dt.toggleRowWithRadio(
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
