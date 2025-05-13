import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { AlertComponent, AlertType } from '../../shared/alert/alert.component';

export interface ConfirmOptions extends AlertOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
}
export interface AlertOptions {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  duration?: number;
  showActions?: boolean;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  private alertRefs: ComponentRef<AlertComponent>[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  success(message: string, title: string = 'הצלחה'): void {
    this.show({
      type: 'success',
      title,
      message
    });
  }

  /**
   * Show an error alert
   */
  error(message: string, title: string = 'שגיאה'): void {
    this.show({
      type: 'error',
      title,
      message,
      autoClose: false
    });
  }

  /**
   * Show a warning alert
   */
  warning(message: string, title: string = 'אזהרה'): void {
    this.show({
      type: 'warning',
      title,
      message
    });
  }

  /**
   * Show an info alert
   */
  info(message: string, title: string = 'מידע'): void {
    this.show({
      type: 'info',
      title,
      message
    });
  }

  /**
   * Show a confirmation alert
   */
  confirm(options: ConfirmOptions): void {
    console.log('Confirm options:', options);
    
    const alertRef = this.show({
      type: options.type || 'warning',
      title: options.title || 'אישור',
      message: options.message,
      dismissible: options.dismissible !== undefined ? options.dismissible : true,
      autoClose: false,
      showActions: true,
      confirmText: options.confirmText || 'אישור',
      cancelText: options.cancelText || 'ביטול'
    });

    alertRef.instance.confirmed.subscribe(() => {
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    alertRef.instance.cancelled.subscribe(() => {
      if (options.onCancel) {
        options.onCancel();
      }
    });
  }

  /**
   * Show a custom alert
   */
  show(options: AlertOptions): ComponentRef<AlertComponent> {
    // Create component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const componentRef = componentFactory.create(this.injector) as ComponentRef<AlertComponent>;
    
    // Set component inputs
    const instance = componentRef.instance as AlertComponent;
    instance.type = options.type || 'default';
    instance.title = options.title || '';
    instance.message = options.message;
    instance.dismissible = options.dismissible !== undefined ? options.dismissible : true;
    instance.autoClose = options.autoClose !== undefined ? options.autoClose : true;
    instance.duration = options.duration || 5000;
    instance.showActions = options.showActions || false;
    instance.confirmText = options.confirmText || 'אישור';
    instance.cancelText = options.cancelText || 'ביטול';
    
    // Handle close event
    instance.closed.subscribe(() => {
      this.removeAlert(componentRef);
    });
    
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);
    
    // Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    
    // Append to body
    document.body.appendChild(domElem);
    
    // Add to tracked refs
    this.alertRefs.push(componentRef);
    
    return componentRef;
  }

  /**
   * Remove an alert
   */
  private removeAlert(alertRef: ComponentRef<AlertComponent>): void {
    const index = this.alertRefs.indexOf(alertRef);
    if (index > -1) {
      this.appRef.detachView(alertRef.hostView);
      alertRef.destroy();
      this.alertRefs.splice(index, 1);
    }
  }

  /**
   * Clear all alerts
   */
  clearAll(): void {
    this.alertRefs.forEach(ref => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    });
    this.alertRefs = [];
  }

  
}
