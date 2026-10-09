import { TestBed } from '@angular/core/testing';

import { Visa } from './visa';

describe('Visa', () => {
  let service: Visa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Visa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
