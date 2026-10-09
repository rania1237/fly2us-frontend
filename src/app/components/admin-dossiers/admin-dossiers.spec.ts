import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDossiers } from './admin-dossiers';

describe('AdminDossiers', () => {
  let component: AdminDossiers;
  let fixture: ComponentFixture<AdminDossiers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDossiers],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDossiers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
