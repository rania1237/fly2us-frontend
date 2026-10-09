import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTarifs } from './admin-tarifs';

describe('AdminTarifs', () => {
  let component: AdminTarifs;
  let fixture: ComponentFixture<AdminTarifs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTarifs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTarifs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
