import { TestBed } from '@angular/core/testing';

import { WeatherCode } from './weather-code';

describe('WeatherCode', () => {
  let service: WeatherCode;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherCode);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
