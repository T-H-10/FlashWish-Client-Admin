import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() icon: string = 'search_off';
  @Input() title: string = 'לא נמצאו תוצאות';
  @Input() description: string = 'לא נמצאו פריטים התואמים לחיפוש שלך';
  @Input() suggestions: Array<{icon: string, text: string}> = [];
  @Input() actionText?: string;
  @Input() actionIcon?: string;
  @Input() actionCallback?: () => void;
}
