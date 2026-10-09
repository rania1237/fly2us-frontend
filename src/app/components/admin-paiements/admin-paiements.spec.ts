import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaiements } from './admin-paiements';

describe('AdminPaiements', () => {
  let component: AdminPaiements;
  let fixture: ComponentFixture<AdminPaiements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPaiements],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPaiements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
