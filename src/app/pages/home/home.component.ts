import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.requestData().subscribe(res => {
      console.log('Result', res);
    }, err => {
      console.error(err);
    });
  }

  onSubmit() {
    
  }

}
