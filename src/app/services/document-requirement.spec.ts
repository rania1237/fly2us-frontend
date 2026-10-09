import { TestBed } from '@angular/core/testing';

import { DocumentRequirement } from './document-requirement';

describe('DocumentRequirement', () => {
  let service: DocumentRequirement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentRequirement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
