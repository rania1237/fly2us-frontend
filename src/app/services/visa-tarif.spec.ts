import { TestBed } from '@angular/core/testing';

import { VisaTarif } from './visa-tarif';

describe('VisaTarif', () => {
  let service: VisaTarif;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisaTarif);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
