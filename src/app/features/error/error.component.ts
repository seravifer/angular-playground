import { Component, NgZone, OnDestroy } from '@angular/core';
import { concat, EMPTY, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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

  observableWithError() {
    concat(
      of('').pipe(
        tap(() => {
          console.log('First observable');
        }),
        map(res => {
          throw new Error('first-error');
        }),
        /*catchError(err => {
          console.log('catchError', err);
          throw err;
        })*/
      ),
      of('').pipe(
        tap(() => {
          console.log('Second observable');
        })
      )
    ).subscribe(res => {
        console.log('Success!', res);
      }, err => {
        console.log('Global error:', err.message);
      });


    of('first').pipe(
      map(res => {
        throw new Error('Error');
      }),
      catchError(err => {
        console.log('catchError');
        // TODO: show modal
        return EMPTY;
      }),
      switchMap(res => of('second'))
    ).subscribe(res => {
        console.log('Success!', res);
      }, err => {
        console.log('Global error');
      });
  }



}
