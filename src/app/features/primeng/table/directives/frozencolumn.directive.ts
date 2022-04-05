import { AfterViewInit, Directive, Input, ElementRef } from '@angular/core';
import { DomHandler } from 'primeng/dom';

@Directive({
  selector: '[pFrozenColumn]',
  host: {
    '[class.p-frozen-column]': 'frozen',
  },
})
export class FrozenColumn implements AfterViewInit {
  @Input() get frozen(): boolean {
    return this._frozen;
  }

  set frozen(val: boolean) {
    this._frozen = val;
    this.updateStickyPosition();
  }

  @Input() alignFrozen = 'left';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.updateStickyPosition();
  }

  _frozen = true;

  updateStickyPosition() {
    if (this._frozen) {
      if (this.alignFrozen === 'right') {
        let right = 0;
        const next = this.el.nativeElement.nextElementSibling;
        if (next) {
          right =
            DomHandler.getOuterWidth(next) +
            (parseFloat(next.style.right) || 0);
        }
        this.el.nativeElement.style.right = right + 'px';
      } else {
        let left = 0;
        const prev = this.el.nativeElement.previousElementSibling;
        if (prev) {
          left =
            DomHandler.getOuterWidth(prev) + (parseFloat(prev.style.left) || 0);
        }
        this.el.nativeElement.style.left = left + 'px';
      }

      const filterRow = this.el.nativeElement.parentElement.nextElementSibling;

      if (filterRow) {
        const index = DomHandler.index(this.el.nativeElement);
        if (filterRow.children && filterRow.children[index]) {
          filterRow.children[index].style.left =
            this.el.nativeElement.style.left;
          filterRow.children[index].style.right =
            this.el.nativeElement.style.right;
        }
      }
    }
  }
}
