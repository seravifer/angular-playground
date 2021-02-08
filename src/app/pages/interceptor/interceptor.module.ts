import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterceptorRoutingModule } from './interceptor-routing.module';
import { InterceptorComponent } from './interceptor.component';


@NgModule({
  declarations: [InterceptorComponent],
  imports: [
    CommonModule,
    InterceptorRoutingModule
  ]
})
export class InterceptorModule { }
