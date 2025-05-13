import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'default';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})

export class AlertComponent implements OnInit, OnDestroy {
  @Input() type: AlertType = 'default';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() autoClose: boolean = true;
  @Input() duration: number = 5000;
  @Input() showActions: boolean = false;
  @Input() confirmText: string = 'אישור';
  @Input() cancelText: string = 'ביטול';
  
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  
  visible: boolean = false;
  animationState: 'enter' | 'leave' = 'enter';
  private timeout: any;
  
  ngOnInit() {
    this.visible = true;
    
    if (this.autoClose && !this.showActions) {
      this.timeout = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }
  
  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  close() {
    this.animationState = 'leave';
    setTimeout(() => {
      this.visible = false;
      this.closed.emit();
    }, 300);
  }
  
  onConfirm() {
    this.confirmed.emit();
    this.close();
  }
  
  onCancel() {
    this.cancelled.emit();
    this.close();
  }
  
  getIconForType(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }

}
