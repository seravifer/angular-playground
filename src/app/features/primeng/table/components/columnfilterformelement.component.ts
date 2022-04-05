import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FilterMetadata } from 'primeng/api';
import { Table } from '../table.component';

@Component({
  selector: 'p-columnFilterFormElement',
  template: `
    <ng-container *ngIf="filterTemplate; else builtInElement">
      <ng-container
        *ngTemplateOutlet="
          filterTemplate;
          context: {
            $implicit: filterConstraint.value,
            filterCallback: filterCallback
          }
        "
      ></ng-container>
    </ng-container>
    <ng-template #builtInElement>
      <ng-container [ngSwitch]="type">
        <input
          *ngSwitchCase="'text'"
          type="text"
          pInputText
          [value]="filterConstraint?.value"
          (input)="onModelChange($event.target.value)"
          (keydown.enter)="onTextInputEnterKeyDown($event)"
          [attr.placeholder]="placeholder"
        />
        <p-inputNumber
          *ngSwitchCase="'numeric'"
          [ngModel]="filterConstraint?.value"
          (ngModelChange)="onModelChange($event)"
          (onKeyDown)="onNumericInputKeyDown($event)"
          [showButtons]="true"
          [minFractionDigits]="minFractionDigits"
          [maxFractionDigits]="maxFractionDigits"
          [prefix]="prefix"
          [suffix]="suffix"
          [placeholder]="placeholder"
          [mode]="currency ? 'currency' : 'decimal'"
          [locale]="locale"
          [localeMatcher]="localeMatcher"
          [currency]="currency"
          [currencyDisplay]="currencyDisplay"
          [useGrouping]="useGrouping"
        ></p-inputNumber>
        <p-triStateCheckbox
          *ngSwitchCase="'boolean'"
          [ngModel]="filterConstraint?.value"
          (ngModelChange)="onModelChange($event)"
        ></p-triStateCheckbox>
        <p-calendar
          *ngSwitchCase="'date'"
          [placeholder]="placeholder"
          [ngModel]="filterConstraint?.value"
          (ngModelChange)="onModelChange($event)"
        ></p-calendar>
      </ng-container>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ColumnFilterFormElement implements OnInit {
  @Input() field: string;

  @Input() type: string;

  @Input() filterConstraint: FilterMetadata;

  @Input() filterTemplate: TemplateRef<any>;

  @Input() placeholder: string;

  @Input() minFractionDigits: number;

  @Input() maxFractionDigits: number;

  @Input() prefix: string;

  @Input() suffix: string;

  @Input() locale: string;

  @Input() localeMatcher: string;

  @Input() currency: string;

  @Input() currencyDisplay: string;

  @Input() useGrouping: boolean = true;

  filterCallback: Function;

  constructor(public dt: Table) {}

  ngOnInit() {
    this.filterCallback = (value) => {
      this.filterConstraint.value = value;
      this.dt._filter();
    };
  }

  onModelChange(value: any) {
    this.filterConstraint.value = value;

    if (this.type === 'boolean' || value === '') {
      this.dt._filter();
    }
  }

  onTextInputEnterKeyDown(event: KeyboardEvent) {
    this.dt._filter();
    event.preventDefault();
  }

  onNumericInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.dt._filter();
      event.preventDefault();
    }
  }
}
