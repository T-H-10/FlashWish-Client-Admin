import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { CardsService } from '../../services/cards/cards.service';
import { TemplateService } from '../../services/template/template.service';
import { ContentService } from '../../services/content/content.service';
import { MatDialog } from '@angular/material/dialog';
import { ContentsDialogComponent } from '../contents/contents-dialog/contents-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css', './categories2.component.css', './categories3.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryState: Record<number, { cards: number; templates: number; contents: number }> = {};

  filteredCategories: Category[] = [];
  searchControl = new FormControl('');

  constructor(private categoryService: CategoryService,
    private cardsService: CardsService,
    private templateService: TemplateService,
    private contentService: ContentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterCategories(value || '');
    })
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = categories;
      for (const category of this.categories) {
        const id = category.categoryID;
        this.categoryState[id] = {
          cards: this.countCardsByCategoryId(id),
          templates: this.countTemplatesByCategoryId(id),
          contents: this.countContentsByCategoryId(id),
        };
      }
    })
  }

  countCardsByCategoryId(categoryID: number): number {
    return this.cardsService.getCardsByCategoryId(categoryID)?.length || 0;
  }

  countContentsByCategoryId(categoryID: number): number {
    return this.contentService.getContentByCategoryId(categoryID)?.length || 0;
  }

  countTemplatesByCategoryId(categoryID: number): number {
    return this.templateService.getTemplatesByCategoryId(categoryID)?.length || 0;
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.addCategory(result).subscribe({
          next: () => {
            this.getAllCategories();
            Swal.fire({
              icon: 'success',
              title: 'קטגוריה נוספה בהצלחה',
            });
          },
          error: (error) => {
            if(error.status===409){
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'קיימת קטגוריה בעלת שם זהה.'
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת הקטגוריה.'
            });
          }
        }
        });
      }
    });
  }

  editCategory(category: Category): void {
        const dialogRef = this.dialog.open(CategoryDialogComponent, {
          width: '400px',
          data: { mode: 'edit', category }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.categoryService.updateCategory(category.categoryID, result).subscribe({
              next: () => {
                this.getAllCategories();
                Swal.fire({
                  icon: 'success',
                  title: 'קטגוריה עודכנה בהצלחה',
                });
              },
              error: (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'שגיאה',
                  text: 'אירעה שגיאה בעת עדכון הקטגוריה.'
                });
              }
            });
          }
        });
   }

  deleteCategory(categoryID: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: 'לא תוכל לשחזר לאחר המחיקה!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, מחק את זה!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryID).subscribe({
          next: () => {
            this.getAllCategories();
            Swal.fire(
              'מחק',
              'קטגוריה נמחקה בהצלחה.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת מחיקת הקטגוריה.'
            });
          }
        });
      }
    });
  }

  private filterCategories(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.categoryName.toLowerCase().includes(lower)
    );
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
   * Calculate percentage for stat bars
   */
  getPercentage(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min(100, (value / max) * 100);
  }
  
  /**
   * Get maximum number of cards across all categories
   */
  getMaxCards(): number {
    if (!this.categories || !this.categoryState) return 1;
    let max = 1; // Default to 1 to avoid division by zero
    
    this.categories.forEach(category => {
      const count = this.categoryState[category.categoryID]?.cards || 0;
      if (count > max) max = count;
    });
    
    return max;
  }
  
  /**
   * Get maximum number of templates across all categories
   */
  getMaxTemplates(): number {
    if (!this.categories || !this.categoryState) return 1;
    let max = 1;
    
    this.categories.forEach(category => {
      const count = this.categoryState[category.categoryID]?.templates || 0;
      if (count > max) max = count;
    });
    
    return max;
  }
  
  /**
   * Get maximum number of contents across all categories
   */
  getMaxContents(): number {
    if (!this.categories || !this.categoryState) return 1;
    let max = 1;
    
    this.categories.forEach(category => {
      const count = this.categoryState[category.categoryID]?.contents || 0;
      if (count > max) max = count;
    });
    
    return max;
  }
}
