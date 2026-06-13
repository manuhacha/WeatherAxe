import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyWeather } from './hourly-weather';

describe('WeeklyWeather', () => {
  let component: WeeklyWeather;
  let fixture: ComponentFixture<WeeklyWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyWeather]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
