import { TestBed } from '@angular/core/testing';

import { OpenMeteo } from './open-meteo';

describe('OpenMeteo', () => {
  let service: OpenMeteo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenMeteo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
