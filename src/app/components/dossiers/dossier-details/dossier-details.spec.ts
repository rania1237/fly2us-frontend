import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierDetails } from './dossier-details';

describe('DossierDetails', () => {
  let component: DossierDetails;
  let fixture: ComponentFixture<DossierDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DossierDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
