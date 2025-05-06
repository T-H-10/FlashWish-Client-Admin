import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent implements OnChanges {
  @Input() target=0;
  current = signal(0);

  private animationId: number | null = null;

  ngOnChanges(change: SimpleChanges) {
    if (change['target']) {
      this.startCounting();
    }
  }

  startCounting() {
    if(this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    const duration = 1000;
    const start = performance.now();
    const initial = this.current();
    const delta = this.target - initial;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      this.current.set(Math.floor(initial + delta * progress));
      if (progress < 1) {

        this.animationId = requestAnimationFrame(step);
      } 
    };
    requestAnimationFrame(step);
  }

}
