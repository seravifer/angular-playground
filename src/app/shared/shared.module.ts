import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [RatingComponent],
  declarations: [
    RatingComponent
  ],
  providers: []
})
export class SharedModule { }
