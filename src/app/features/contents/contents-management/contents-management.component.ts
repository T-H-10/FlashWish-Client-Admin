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
import { UserNamePipe } from '../../../pipes/user-name.pipe';
import { CardsService } from '../../../services/cards/cards.service';
import { DatePipe } from '@angular/common';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';
import { SortDirection, SortField } from '../../templates/templates-management/templates-management.component';
import { EmptyStateComponent } from "../../../shared/empty-state/empty-state/empty-state.component";
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
    UserNamePipe,
    DatePipe,
    EmptyStateComponent
],
  templateUrl: './contents-management.component.html',
  styleUrls: ['./contents-management.component.css', './contents-management2.component.css', './contents-management3.component.css',
    '../../../shared/filter-and-sort-styles.css']
})
export class ContentsManagementComponent implements OnInit {
  contents: Content[] = []; 
  filteredContents: Content[] = []; 
  searchControl = new FormControl('');
  categories:Category[]=[];
  contentInLines:string[] = [];
    // Sort and filter state
    sortField: SortField = '';
    sortDirection: SortDirection = 'asc';
    selectedCategoryId: number = 0;
    showFilterMenu: boolean = false;
    showSortMenu: boolean = false;
  
  constructor(private contentService: ContentService,
     private dialog: MatDialog,
     private categoryService: CategoryService,
     private cardsService: CardsService) { }

  ngOnInit(): void {
    this.getAllContents();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterContents(value || '');
    });
    this.categoryService.getAllCategories().subscribe(categories=>{
      this.categories = categories;
     })  
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

  getCategoryName(categoryID: number): string {
    return this.categoryService.getCategoryNameById(categoryID) || "nothing";
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

   // Filter and sort methods
   toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
    if (this.showFilterMenu) {
      this.showSortMenu = false;
    }
  }

  toggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
    if (this.showSortMenu) {
      this.showFilterMenu = false;
    }
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.showFilterMenu = false;
    this.applyFiltersAndSort();
  }

  sortMessages(field: SortField): void {
    if (this.sortField === field) {
      // Toggle direction if same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.showSortMenu = false;
    this.applyFiltersAndSort();
  }

  resetSort(): void {
    this.sortField = '';
    this.sortDirection = 'asc';
    this.applyFiltersAndSort();
  }

  getSortFieldName(): string {
    switch (this.sortField) {
      case 'name': return 'שם';
      case 'category': return 'קטגוריה';
      case 'date': return 'תאריך';
      case 'usage': return 'שימוש';
      default: return '';
    }
  }

  private filterContents(searchTerm: string): void {
    // const lower = searchTerm.toLowerCase();
    // this.filteredContents = this.contents.filter(content => {
    //   return content.title.toLowerCase().includes(lower)
    //     || content.content.toLowerCase().includes(lower)
    //     || content.signature.toLowerCase().includes(lower)
    // });
    this.applyFiltersAndSort(searchTerm);
  }

  
    private applyFiltersAndSort(searchTerm: string = this.searchControl.value || ''): void {
      // First apply search filter
      const lower = searchTerm.toLowerCase();
      let result = this.contents.filter(content =>
        content.title.toLowerCase().includes(lower)
      );
      
      // Then apply category filter
      if (this.selectedCategoryId !== 0) {
        result = result.filter(template => template.categoryID === this.selectedCategoryId);
      }
      
      // Then apply sorting
      if (this.sortField) {
        result = this.sortTemplatesByField(result, this.sortField, this.sortDirection);
      }
      
      this.filteredContents = result;
    }
  
    private sortTemplatesByField(contents: Content[], field: SortField, direction: SortDirection): Content[] {
      return [...contents].sort((a, b) => {
        let comparison = 0;
        
        switch (field) {
          // case 'name':
          //   comparison = a..localeCompare(b.templateName);
          //   break;
          case 'category':
            const catA = this.getCategoryName(a.categoryID);
            const catB = this.getCategoryName(b.categoryID);
            comparison = catA.localeCompare(catB);
            break;
          case 'date':
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case 'usage':
            const usageA = this.countCardsByTextId(a.textID);
            const usageB = this.countCardsByTextId(b.textID);
            comparison = usageA - usageB;
            break;
        }
        
        return direction === 'asc' ? comparison : -comparison;
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
  handleEmptyStateAction(): void {
    this.addContent();
  }

    // Add this method to get appropriate empty state data
    getEmptyStateData() {
      const hasActiveFilters = this.selectedCategoryId !== 0 || this.sortField !== '' || (this.searchControl.value && this.searchControl.value.trim() !== '');
      
      if (hasActiveFilters) {
        return {
          icon: 'search_off',
          title: 'לא נמצאו תוצאות',
          description: 'לא נמצאו תכנים התואמים לקריטריונים שבחרת',
          suggestions: [
            { icon: 'clear', text: 'נקה את הסינונים הפעילים' },
            { icon: 'search', text: 'נסה מילות חיפוש אחרות' },
            { icon: 'category', text: 'בחר קטגוריה אחרת' }
          ],
          actionText: 'נקה סינונים',
          actionIcon: 'clear_all',
          actionCallback: () => this.clearAllFilters()
        };
      } else {
        return {
          icon: 'note_add',
          title: 'אין תכנים במערכת',
          description: 'עדיין לא הוספת תכנים למערכת. התחל על ידי הוספת התוכן הראשון שלך',
          suggestions: [
            { icon: 'add_circle', text: 'הוסף תוכן חדש' },
            { icon: 'upload', text: 'ייבא תכנים קיימים' },
            { icon: 'help', text: 'עיין במדריך השימוש' }
          ],
          actionText: 'הוסף תוכן ראשון',
          actionIcon: 'add',
          actionCallback: () => this.addContent()
        };
      }
    }
  
    // Add this method to clear all filters
    clearAllFilters(): void {
      this.selectedCategoryId = 0;
      this.sortField = '';
      this.sortDirection = 'asc';
      this.searchControl.setValue('');
      this.showFilterMenu = false;
      this.showSortMenu = false;
      this.applyFiltersAndSort();
    }
}
