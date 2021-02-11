import { Component, NgZone, OnDestroy } from '@angular/core';
import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnDestroy {

  private gOldOnError: any;

  constructor(
    private ngZone: NgZone
  ) {
    this.initGlobalErrorHandler();
  }

  initGlobalErrorHandler() {
    this.gOldOnError = window.onerror;
    // Override previous handler.
    window.onerror = (errorMsg, url, lineNumber) => {
      if (this.gOldOnError) {
        // Call previous handler.
        return this.gOldOnError(errorMsg, url, lineNumber);
      }
      console.log('window.onerror', errorMsg);
      // Just let default handler run.
      return false;
    };
  }

  ngOnDestroy() {
    window.onerror = this.gOldOnError;
  }

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
    } catch (err) {
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
