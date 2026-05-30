import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeather } from './daily-weather';

describe('DailyWeather', () => {
  let component: DailyWeather;
  let fixture: ComponentFixture<DailyWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyWeather]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
