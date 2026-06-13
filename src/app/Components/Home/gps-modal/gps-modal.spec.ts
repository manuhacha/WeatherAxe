import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsModal } from './gps-modal';

describe('GpsModal', () => {
  let component: GpsModal;
  let fixture: ComponentFixture<GpsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
