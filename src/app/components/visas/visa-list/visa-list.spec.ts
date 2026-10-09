import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaList } from './visa-list';

describe('VisaList', () => {
  let component: VisaList;
  let fixture: ComponentFixture<VisaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisaList],
    }).compileComponents();

    fixture = TestBed.createComponent(VisaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
