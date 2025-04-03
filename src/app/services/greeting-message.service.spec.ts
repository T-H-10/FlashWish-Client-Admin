import { TestBed } from '@angular/core/testing';

import { GreetingMessageService } from './greeting-message.service';

describe('GreetingMessageService', () => {
  let service: GreetingMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreetingMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
