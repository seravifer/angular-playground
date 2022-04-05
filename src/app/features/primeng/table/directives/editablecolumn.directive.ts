import {
  HostListener,
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
  selector: '[pEditableColumn]',
})
export class EditableColumn implements AfterViewInit, OnDestroy {
  @Input('pEditableColumn') data: any;

  @Input('pEditableColumnField') field: any;

  @Input('pEditableColumnRowIndex') rowIndex: number;

  @Input() pEditableColumnDisabled: boolean;

  @Input() pFocusCellSelector: string;

  overlayEventListener;

  constructor(public dt: Table, public el: ElementRef, public zone: NgZone) {}

  ngAfterViewInit() {
    if (this.isEnabled()) {
      DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isEnabled()) {
      this.dt.selfClick = true;

      if (this.dt.editingCell) {
        if (this.dt.editingCell !== this.el.nativeElement) {
          if (!this.dt.isEditingCellValid()) {
            return;
          }

          this.closeEditingCell(true, event);
          this.openCell();
        }
      } else {
        this.openCell();
      }
    }
  }

  openCell() {
    this.dt.updateEditingCell(
      this.el.nativeElement,
      this.data,
      this.field,
      this.rowIndex
    );
    DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
    this.dt.onEditInit.emit({
      field: this.field,
      data: this.data,
      index: this.rowIndex,
    });
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        let focusCellSelector =
          this.pFocusCellSelector || 'input, textarea, select';
        let focusableElement = DomHandler.findSingle(
          this.el.nativeElement,
          focusCellSelector
        );

        if (focusableElement) {
          focusableElement.focus();
        }
      }, 50);
    });

    this.overlayEventListener = (e) => {
      if (this.el && this.el.nativeElement.contains(e.target)) {
        this.dt.selfClick = true;
      }
    };

    this.dt.overlaySubscription =
      this.dt.overlayService.clickObservable.subscribe(
        this.overlayEventListener
      );
  }

  closeEditingCell(completed, event) {
    if (completed)
      this.dt.onEditComplete.emit({
        field: this.dt.editingCellField,
        data: this.dt.editingCellData,
        originalEvent: event,
        index: this.dt.editingCellRowIndex,
      });
    else
      this.dt.onEditCancel.emit({
        field: this.dt.editingCellField,
        data: this.dt.editingCellData,
        originalEvent: event,
        index: this.dt.editingCellRowIndex,
      });

    DomHandler.removeClass(this.dt.editingCell, 'p-cell-editing');
    this.dt.editingCell = null;
    this.dt.editingCellData = null;
    this.dt.editingCellField = null;
    this.dt.unbindDocumentEditListener();

    if (this.dt.overlaySubscription) {
      this.dt.overlaySubscription.unsubscribe();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    if (this.isEnabled()) {
      if (this.dt.isEditingCellValid()) {
        this.closeEditingCell(true, event);
      }

      event.preventDefault();
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKeyDown(event: KeyboardEvent) {
    if (this.isEnabled()) {
      if (this.dt.isEditingCellValid()) {
        this.closeEditingCell(false, event);
      }

      event.preventDefault();
    }
  }

  @HostListener('keydown.tab', ['$event'])
  @HostListener('keydown.shift.tab', ['$event'])
  @HostListener('keydown.meta.tab', ['$event'])
  onShiftKeyDown(event: KeyboardEvent) {
    if (this.isEnabled()) {
      if (event.shiftKey) this.moveToPreviousCell(event);
      else {
        this.moveToNextCell(event);
      }
    }
  }
  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    if (this.isEnabled()) {
      let currentCell = this.findCell(event.target);
      if (currentCell) {
        let cellIndex = DomHandler.index(currentCell);
        let targetCell = this.findNextEditableColumnByIndex(
          currentCell,
          cellIndex
        );

        if (targetCell) {
          if (this.dt.isEditingCellValid()) {
            this.closeEditingCell(true, event);
          }

          DomHandler.invokeElementMethod(event.target, 'blur');
          DomHandler.invokeElementMethod(targetCell, 'click');
        }

        event.preventDefault();
      }
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    if (this.isEnabled()) {
      let currentCell = this.findCell(event.target);
      if (currentCell) {
        let cellIndex = DomHandler.index(currentCell);
        let targetCell = this.findPrevEditableColumnByIndex(
          currentCell,
          cellIndex
        );

        if (targetCell) {
          if (this.dt.isEditingCellValid()) {
            this.closeEditingCell(true, event);
          }

          DomHandler.invokeElementMethod(event.target, 'blur');
          DomHandler.invokeElementMethod(targetCell, 'click');
        }

        event.preventDefault();
      }
    }
  }

  @HostListener('keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    if (this.isEnabled()) {
      this.moveToPreviousCell(event);
    }
  }

  @HostListener('keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (this.isEnabled()) {
      this.moveToNextCell(event);
    }
  }

  findCell(element) {
    if (element) {
      let cell = element;
      while (cell && !DomHandler.hasClass(cell, 'p-cell-editing')) {
        cell = cell.parentElement;
      }

      return cell;
    } else {
      return null;
    }
  }

  moveToPreviousCell(event: KeyboardEvent) {
    let currentCell = this.findCell(event.target);
    if (currentCell) {
      let targetCell = this.findPreviousEditableColumn(currentCell);

      if (targetCell) {
        if (this.dt.isEditingCellValid()) {
          this.closeEditingCell(true, event);
        }

        DomHandler.invokeElementMethod(event.target, 'blur');
        DomHandler.invokeElementMethod(targetCell, 'click');
        event.preventDefault();
      }
    }
  }

  moveToNextCell(event: KeyboardEvent) {
    let currentCell = this.findCell(event.target);
    if (currentCell) {
      let targetCell = this.findNextEditableColumn(currentCell);

      if (targetCell) {
        if (this.dt.isEditingCellValid()) {
          this.closeEditingCell(true, event);
        }

        DomHandler.invokeElementMethod(event.target, 'blur');
        DomHandler.invokeElementMethod(targetCell, 'click');
        event.preventDefault();
      }
    }
  }

  findPreviousEditableColumn(cell: Element) {
    let prevCell = cell.previousElementSibling;

    if (!prevCell) {
      let previousRow = cell.parentElement.previousElementSibling;
      if (previousRow) {
        prevCell = previousRow.lastElementChild;
      }
    }

    if (prevCell) {
      if (DomHandler.hasClass(prevCell, 'p-editable-column')) return prevCell;
      else return this.findPreviousEditableColumn(prevCell);
    } else {
      return null;
    }
  }

  findNextEditableColumn(cell: Element) {
    let nextCell = cell.nextElementSibling;

    if (!nextCell) {
      let nextRow = cell.parentElement.nextElementSibling;
      if (nextRow) {
        nextCell = nextRow.firstElementChild;
      }
    }

    if (nextCell) {
      if (DomHandler.hasClass(nextCell, 'p-editable-column')) return nextCell;
      else return this.findNextEditableColumn(nextCell);
    } else {
      return null;
    }
  }

  findNextEditableColumnByIndex(cell: Element, index: number) {
    let nextRow = cell.parentElement.nextElementSibling;

    if (nextRow) {
      let nextCell = nextRow.children[index];

      if (nextCell && DomHandler.hasClass(nextCell, 'p-editable-column')) {
        return nextCell;
      }

      return null;
    } else {
      return null;
    }
  }

  findPrevEditableColumnByIndex(cell: Element, index: number) {
    let prevRow = cell.parentElement.previousElementSibling;

    if (prevRow) {
      let prevCell = prevRow.children[index];

      if (prevCell && DomHandler.hasClass(prevCell, 'p-editable-column')) {
        return prevCell;
      }

      return null;
    } else {
      return null;
    }
  }

  isEnabled() {
    return this.pEditableColumnDisabled !== true;
  }

  ngOnDestroy() {
    if (this.dt.overlaySubscription) {
      this.dt.overlaySubscription.unsubscribe();
    }
  }
}
