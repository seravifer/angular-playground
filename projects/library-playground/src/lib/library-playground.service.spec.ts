import { TestBed } from '@angular/core/testing';

import { LibraryPlaygroundService } from './library-playground.service';

describe('LibraryPlaygroundService', () => {
  let service: LibraryPlaygroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryPlaygroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
