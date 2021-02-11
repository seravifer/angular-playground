import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  public newUserForm = new FormGroup({
    id: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]*[a-z]+(\s[A-Z]*[a-z]+)*$/)
    ])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO
  }

}
