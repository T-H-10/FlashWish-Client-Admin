import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentsManagementComponent } from './contents-management.component';

describe('ContentsManagementComponent', () => {
  let component: ContentsManagementComponent;
  let fixture: ComponentFixture<ContentsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
