import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisaAddComponent } from './visa-add.component';

describe('VisaAddComponent', () => {
  let component: VisaAddComponent;
  let fixture: ComponentFixture<VisaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisaAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});