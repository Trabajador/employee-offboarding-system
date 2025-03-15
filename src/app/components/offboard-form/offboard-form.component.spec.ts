import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardFormComponent } from './offboard-form.component';

describe('OffboardFormComponent', () => {
  let component: OffboardFormComponent;
  let fixture: ComponentFixture<OffboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
