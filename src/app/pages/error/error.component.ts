import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  constructor(
    private ngZone: NgZone
  ) { }

  throwSimpleError() {
      throw new Error('throwSimpleError');
  }

  throwOutsideError() {
    this.ngZone.runOutsideAngular(() => {
      throw new Error('runOutsideAngular');
    });
  }

}
