import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentsDialogComponent } from './contents-dialog.component';

describe('ContentsDialogComponent', () => {
  let component: ContentsDialogComponent;
  let fixture: ComponentFixture<ContentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
