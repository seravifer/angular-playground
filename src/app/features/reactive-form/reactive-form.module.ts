import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormRoutingModule } from './reactive-form-routing.module';
import { ReactiveFormComponent } from './reactive-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReactiveFormComponent],
  imports: [
    CommonModule,
    ReactiveFormRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReactiveFormModule { }
