import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengRoutingModule } from './primeng-routing.module';
import { PrimengComponent } from './primeng.component';
import { TableModule } from './table/table.module';

@NgModule({
  declarations: [PrimengComponent],
  imports: [CommonModule, TableModule, PrimengRoutingModule],
})
export class PrimengModule {}
