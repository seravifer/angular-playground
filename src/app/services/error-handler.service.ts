import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor() { }

  handleError(error: any) {
    // console.log('Error', typeof error, (window as any).debug);
    throw new Error(error);
  }

}
