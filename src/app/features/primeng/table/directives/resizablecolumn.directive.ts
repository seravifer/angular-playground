import {
  OnDestroy,
  AfterViewInit,
  Directive,
  Input,
  ElementRef,
  NgZone,
} from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { Table } from '../table.component';

@Directive({
  selector: '[pResizableColumn]',
})
export class ResizableColumn implements AfterViewInit, OnDestroy {
  @Input() pResizableColumnDisabled: boolean;

  resizer: HTMLSpanElement;

  resizerMouseDownListener: any;

  documentMouseMoveListener: any;

  documentMouseUpListener: any;

  constructor(public dt: Table, public el: ElementRef, public zone: NgZone) {}

  ngAfterViewInit() {
    if (this.isEnabled()) {
      DomHandler.addClass(this.el.nativeElement, 'p-resizable-column');
      this.resizer = document.createElement('span');
      this.resizer.className = 'p-column-resizer';
      this.el.nativeElement.appendChild(this.resizer);

      this.zone.runOutsideAngular(() => {
        this.resizerMouseDownListener = this.onMouseDown.bind(this);
        this.resizer.addEventListener(
          'mousedown',
          this.resizerMouseDownListener
        );
      });
    }
  }

  bindDocumentEvents() {
    this.zone.runOutsideAngular(() => {
      this.documentMouseMoveListener = this.onDocumentMouseMove.bind(this);
      document.addEventListener('mousemove', this.documentMouseMoveListener);

      this.documentMouseUpListener = this.onDocumentMouseUp.bind(this);
      document.addEventListener('mouseup', this.documentMouseUpListener);
    });
  }

  unbindDocumentEvents() {
    if (this.documentMouseMoveListener) {
      document.removeEventListener('mousemove', this.documentMouseMoveListener);
      this.documentMouseMoveListener = null;
    }

    if (this.documentMouseUpListener) {
      document.removeEventListener('mouseup', this.documentMouseUpListener);
      this.documentMouseUpListener = null;
    }
  }

  onMouseDown(event: MouseEvent) {
    if (event.which === 1) {
      this.dt.onColumnResizeBegin(event);
      this.bindDocumentEvents();
    }
  }

  onDocumentMouseMove(event: MouseEvent) {
    this.dt.onColumnResize(event);
  }

  onDocumentMouseUp(event: MouseEvent) {
    this.dt.onColumnResizeEnd();
    this.unbindDocumentEvents();
  }

  isEnabled() {
    return this.pResizableColumnDisabled !== true;
  }

  ngOnDestroy() {
    if (this.resizerMouseDownListener) {
      this.resizer.removeEventListener(
        'mousedown',
        this.resizerMouseDownListener
      );
    }

    this.unbindDocumentEvents();
  }
}
