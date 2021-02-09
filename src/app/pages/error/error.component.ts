import { Component, NgZone } from '@angular/core';
import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  throwErrorAndCatch() {
    try {
      throw new Error('throwErrorAndCatch');
    } catch(err) {
      console.log('Catch throwErrorAndCatch');
    }
  }

  throwErrorOnSubscription() {
    of([]).pipe(
      switchMap(() => throwError(new Error('throwErrorOnSubscription')))
    ).subscribe({
      error: error => console.log(error)
    });
  }

}
