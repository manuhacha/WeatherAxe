import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gpssearch } from './gpssearch';

describe('Gpssearch', () => {
  let component: Gpssearch;
  let fixture: ComponentFixture<Gpssearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gpssearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gpssearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
