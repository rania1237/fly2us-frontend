import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierSubmit } from './dossier-submit';

describe('DossierSubmit', () => {
  let component: DossierSubmit;
  let fixture: ComponentFixture<DossierSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DossierSubmit],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierSubmit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
