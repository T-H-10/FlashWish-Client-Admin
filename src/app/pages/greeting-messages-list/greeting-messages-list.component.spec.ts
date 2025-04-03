import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreetingMessagesListComponent } from './greeting-messages-list.component';

describe('GreetingMessagesListComponent', () => {
  let component: GreetingMessagesListComponent;
  let fixture: ComponentFixture<GreetingMessagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreetingMessagesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreetingMessagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
