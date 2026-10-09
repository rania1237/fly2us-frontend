import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMyDossiers } from './client-my-dossiers';

describe('ClientMyDossiers', () => {
  let component: ClientMyDossiers;
  let fixture: ComponentFixture<ClientMyDossiers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientMyDossiers],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMyDossiers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
