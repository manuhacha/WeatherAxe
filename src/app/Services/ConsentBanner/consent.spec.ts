import { TestBed } from '@angular/core/testing';

import { Consent } from './consent';

describe('Consent', () => {
  let service: Consent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Consent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
