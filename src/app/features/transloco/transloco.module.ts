import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslocoRoutingModule } from './transloco-routing.module';
import { TranslocoComponent } from './transloco.component';


@NgModule({
  declarations: [TranslocoComponent],
  imports: [
    CommonModule,
    TranslocoRoutingModule
  ]
})
export class TranslocoModule { }
