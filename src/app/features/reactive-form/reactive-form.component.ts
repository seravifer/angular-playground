import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]*[a-z]+(\s[A-Z]*[a-z]+)*$/),
    ]),
    selectedCountries: new FormArray([]),
  });

  countries: Array<any> = [
    { name: 'India', value: 'india' },
    { name: 'France', value: 'france' },
    { name: 'USA', value: 'USA' },
    { name: 'Germany', value: 'germany' },
    { name: 'Japan', value: 'Japan' },
  ];

  constructor() {}

  onCheckboxChange(event: any) {
    const selectedCountries = this.form.controls.selectedCountries as FormArray;
    if (event.target.checked) {
      selectedCountries.push(new FormControl(event.target.value));
    } else {
      const index = selectedCountries.controls.findIndex(
        (x) => x.value === event.target.value
      );
      selectedCountries.removeAt(index);
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.form.value);
    // TODO
  }
}
