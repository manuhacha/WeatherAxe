import { TestBed } from '@angular/core/testing';

import { GeoCoding } from './geo-coding';

describe('GeoCoding', () => {
  let service: GeoCoding;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoCoding);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
