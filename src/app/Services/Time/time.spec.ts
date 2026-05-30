import { TestBed } from '@angular/core/testing';

import { Time } from './time';

describe('Time', () => {
  let service: Time;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Time);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
