import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingComponent,
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor {

  public rating = 0;
  constructor() { }

  onChange = (_: number) => {};
  onTouch = () => {};

  writeValue(rating: number): void {
    this.rating = rating;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  onClick(index: number) {
    this.rating = index;
    this.onTouch();
    this.onChange(this.rating);
  }

}
