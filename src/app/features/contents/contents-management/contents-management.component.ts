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
  styleUrl: './contents-management.component.css'
})
export class ContentsManagementComponent implements OnInit {
  contents: Content[] = []; // Replace 'any' with your actual content type
  filteredContents: Content[] = []; // Replace 'any' with your actual content type
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
}
