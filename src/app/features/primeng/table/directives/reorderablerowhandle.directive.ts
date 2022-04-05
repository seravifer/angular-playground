import { AfterViewInit, Directive, Input, ElementRef } from '@angular/core';
import { DomHandler } from 'primeng/dom';

@Directive({
  selector: '[pReorderableRowHandle]',
})
export class ReorderableRowHandle implements AfterViewInit {
  @Input('pReorderableRowHandle') index: number;

  constructor(public el: ElementRef) {}

  ngAfterViewInit() {
    DomHandler.addClass(
      this.el.nativeElement,
      'p-datatable-reorderablerow-handle'
    );
  }
}
