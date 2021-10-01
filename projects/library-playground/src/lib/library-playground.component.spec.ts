import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryPlaygroundComponent } from './library-playground.component';

describe('LibraryPlaygroundComponent', () => {
  let component: LibraryPlaygroundComponent;
  let fixture: ComponentFixture<LibraryPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryPlaygroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
