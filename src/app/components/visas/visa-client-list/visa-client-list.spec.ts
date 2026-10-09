import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaClientList } from './visa-client-list';

describe('VisaClientList', () => {
  let component: VisaClientList;
  let fixture: ComponentFixture<VisaClientList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisaClientList],
    }).compileComponents();

    fixture = TestBed.createComponent(VisaClientList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
