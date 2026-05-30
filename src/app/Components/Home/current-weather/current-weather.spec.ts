import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeather } from './current-weather';

describe('CurrentWeather', () => {
  let component: CurrentWeather;
  let fixture: ComponentFixture<CurrentWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeather]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
