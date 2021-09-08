import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RatingComponent } from './rating.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatIconModule],
  exports: [RatingComponent],
  declarations: [RatingComponent]
})
export class RatingModule { }
