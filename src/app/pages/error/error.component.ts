import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
  }

  throwSimpleError() {
      throw new Error('I\'m an error');
  }

  throwOutsideError() {
    this.ngZone.runOutsideAngular(() => {
      throw new Error('I\'m an error');
    });
  }

}
