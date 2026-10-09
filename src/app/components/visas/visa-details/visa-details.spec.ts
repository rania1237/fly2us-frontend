import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaDetails } from './visa-details';

describe('VisaDetails', () => {
  let component: VisaDetails;
  let fixture: ComponentFixture<VisaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisaDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(VisaDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
