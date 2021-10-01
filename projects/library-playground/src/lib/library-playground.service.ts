import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LibraryPlaygroundService {

  constructor(
    @Inject(DOCUMENT) public document: Document
  ) { }

  exampleFunction() {
    return this.document;
  }
}
