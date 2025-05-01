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
  styleUrl: './categories.component.css'
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
    return this.cardsService.getCardsByCategoryId(categoryID).length;
  }

  countContentsByCategoryId(categoryID: number): number {
    return this.contentService.getContentByCategoryId(categoryID).length;
  }

  countTemplatesByCategoryId(categoryID: number): number {
    return this.templateService.getTemplatesByCategoryId(categoryID).length;
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
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת הקטגוריה.'
            });
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

}
