import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { CellEditor } from './components/celleditor.component';
import { ColumnFilter } from './components/column-filter.component';
import { ColumnFilterFormElement } from './components/columnfilterformelement.component';
import { SortIcon } from './components/sorticon.component';
import { TableBody } from './components/tablebody.component';
import { TableCheckbox } from './components/tablecheckbox.component';
import { TableHeaderCheckbox } from './components/tableheadercheckbox.component';
import { TableRadioButton } from './components/tableradiobutton.component';
import { CancelEditableRow } from './directives/canceleditablerow.directive';
import { ContextMenuRow } from './directives/contextmenurow.directive';
import { EditableColumn } from './directives/editablecolumn.directive';
import { EditableRow } from './directives/editablerow.directive';
import { FrozenColumn } from './directives/frozencolumn.directive';
import { InitEditableRow } from './directives/initeditablerow.directive';
import { ReorderableColumn } from './directives/reorderablecolumn.directive';
import { ReorderableRow } from './directives/reorderablerow.directive';
import { ReorderableRowHandle } from './directives/reorderablerowhandle.directive';
import { ResizableColumn } from './directives/resizablecolumn.directive';
import { RowGroupHeader } from './directives/rowgroupheader.directive';
import { RowToggler } from './directives/rowtoggler.directive';
import { SaveEditableRow } from './directives/saveeditablerow.directive';
import { SelectableRow } from './directives/selectablerow.directive';
import { SelectableRowDblClick } from './directives/selectablerowdblclick.directive';
import { SortableColumn } from './directives/sortablecolumn.directive';
import { Table } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    PaginatorModule,
    InputTextModule,
    DropdownModule,
    ScrollingModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    CalendarModule,
    InputNumberModule,
    TriStateCheckboxModule,
  ],
  exports: [
    Table,
    SharedModule,
    SortableColumn,
    FrozenColumn,
    RowGroupHeader,
    SelectableRow,
    RowToggler,
    ContextMenuRow,
    ResizableColumn,
    ReorderableColumn,
    EditableColumn,
    CellEditor,
    SortIcon,
    TableRadioButton,
    TableCheckbox,
    TableHeaderCheckbox,
    ReorderableRowHandle,
    ReorderableRow,
    SelectableRowDblClick,
    EditableRow,
    InitEditableRow,
    SaveEditableRow,
    CancelEditableRow,
    ScrollingModule,
    ColumnFilter,
  ],
  declarations: [
    Table,
    SortableColumn,
    FrozenColumn,
    RowGroupHeader,
    SelectableRow,
    RowToggler,
    ContextMenuRow,
    ResizableColumn,
    ReorderableColumn,
    EditableColumn,
    CellEditor,
    TableBody,
    SortIcon,
    TableRadioButton,
    TableCheckbox,
    TableHeaderCheckbox,
    ReorderableRowHandle,
    ReorderableRow,
    SelectableRowDblClick,
    EditableRow,
    InitEditableRow,
    SaveEditableRow,
    CancelEditableRow,
    ColumnFilter,
    ColumnFilterFormElement,
  ],
})
export class TableModule {}
