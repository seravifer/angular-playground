import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor() { }

  handleError(error: any) {
    console.log('MyErrorHandler', error);
    throw error;
  }

}
