import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Content } from '../../../models/content.model';
import { ContentService } from '../../../services/content/content.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ContentsDialogComponent } from '../contents-dialog/contents-dialog.component';
import Swal from 'sweetalert2';
import { CategoryNamePipe } from '../../../pipes/category-name.pipe';
import { UserNamePipe } from '../../../pipes/user-name.pipe';
import { CardsService } from '../../../services/cards/cards.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-contents-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CategoryNamePipe,
    UserNamePipe,
    DatePipe
  ],
  templateUrl: './contents-management.component.html',
  styleUrls: ['./contents-management.component.css', './contents-management2.component.css', './contents-management3.component.css']
})
export class ContentsManagementComponent implements OnInit {
  contents: Content[] = []; 
  filteredContents: Content[] = []; 
  searchControl = new FormControl('');
  contentInLines:string[] = [];
  
  constructor(private contentService: ContentService,
     private dialog: MatDialog,
     private cardsService: CardsService) { }

  ngOnInit(): void {
    this.getAllContents();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterContents(value || '');
    });
  }

  getAllContents(): void {
    this.contentService.getAllContents().subscribe(contents => {
      this.contents = contents;
      this.filteredContents = contents;
    });
  }

  countCardsByTextId(textID: number): number {
    return this.cardsService.getCardsByTextId(textID).length;
  }

  addContent(): void {
    const dialogRef = this.dialog.open(ContentsDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentService.addContent(result).subscribe({
          next: () => {
            this.getAllContents();
            Swal.fire({
              icon: 'success',
              title: 'התוכן נוסף בהצלחה',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת התוכן.'
            });
          }
        });
      }
    });
  }

  editContent(content: Content): void {
    const dialogRef = this.dialog.open(ContentsDialogComponent, {
      width: '400px',
      data: { mode: 'edit', content }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentService.updateContent(content.textID, result).subscribe({
          next: () => {
            this.getAllContents();
            Swal.fire({
              icon: 'success',
              title: 'התוכן עודכן בהצלחה',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת עדכון התוכן.'
            });
          }
        });
      }
    });
  }

  deleteContent(contentID: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: 'לא תוכל לשחזר את התוכן הזה לאחר המחיקה!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, מחק את זה!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contentService.deleteContent(contentID).subscribe({
          next: () => {
            this.getAllContents();
            Swal.fire(
              'מחק',
              'התוכן נמחק בהצלחה.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת מחיקת התוכן.'
            });
          }
        });
      }
    });
  }

  private filterContents(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredContents = this.contents.filter(content => {
      return content.title.toLowerCase().includes(lower)
        || content.content.toLowerCase().includes(lower)
        || content.signature.toLowerCase().includes(lower)
    });
  }

  activateCard(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate the position for the glow effect (in percentage)
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;
    
    // Apply the glow effect position
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${posX}% ${posY}%, var(--glow-color) 0%, transparent 70%)`;
      glow.style.opacity = '0.15';
    }
    
    // Apply 3D rotation effect
    const rotateY = ((x / rect.width) - 0.5) * 10; // -5 to 5 degrees
    const rotateX = ((y / rect.height) - 0.5) * -10; // -5 to 5 degrees
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }
  
  /**
   * Deactivates the 3D card effect on mouse leave
   */
  deactivateCard(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    
    // Reset the transform
    card.style.transform = '';
    
    // Reset the glow
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.opacity = '0';
    }
  }
  
  /**
   * Calculate usage percentage for the content
   */
  getUsagePercentage(textId: number): number {
    // Get the count of cards using this content
    const count = this.countCardsByTextId(textId);
    
    // Get the maximum count across all contents for comparison
    const maxCount = this.getMaxCardCount();
    
    // Calculate percentage (with a minimum of 5% for visibility)
    return maxCount === 0 ? 5 : Math.max(5, Math.min(100, Math.round((count / maxCount) * 100)));
  }
  
  /**
   * Get the maximum card count across all contents
   */
  private getMaxCardCount(): number {
    if (!this.filteredContents || this.filteredContents.length === 0) return 1;
    
    let maxCount = 0;
    this.filteredContents.forEach(content => {
      const count = this.countCardsByTextId(content.textID);
      if (count > maxCount) maxCount = count;
    });
    
    return maxCount === 0 ? 1 : maxCount; // Avoid division by zero
  }
}
