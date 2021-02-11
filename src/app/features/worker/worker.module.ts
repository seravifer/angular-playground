import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerRoutingModule } from './worker-routing.module';
import { WorkerComponent } from './worker.component';


@NgModule({
  declarations: [WorkerComponent],
  imports: [
    CommonModule,
    WorkerRoutingModule
  ]
})
export class WorkerModule { }
