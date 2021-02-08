import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor() { }

  handleError(error: any) {
    console.log('Log Error', error);
    throw error;
  }

}
