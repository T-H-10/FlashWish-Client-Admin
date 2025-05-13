import { Component, OnInit } from '@angular/core';
import { Template } from '../../../models/template.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TemplateService } from '../../../services/template/template.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { TemplateDialogComponent } from '../template-dialog/template-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../services/category/category.service';
import { environment } from '../../../../environments/environment';
import { CategoryNamePipe } from '../../../pipes/category-name.pipe';
import { UserNamePipe } from '../../../pipes/user-name.pipe';
import { CardsService } from '../../../services/cards/cards.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-templates-management',
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
    DatePipe,
  ],
  templateUrl: './templates-management.component.html',
  styleUrl: './templates-management.component.css'
})
export class TemplatesManagementComponent implements OnInit {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchControl = new FormControl('');

  constructor(private templateService: TemplateService,
     private dialog: MatDialog, 
     private categoryService:CategoryService,
    private cardsService: CardsService) { }

  ngOnInit(): void {
    this.getAllTemplates();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterTemplates(value || '');
    });   
  }

  getAllTemplates(): void {
    this.templateService.getAllTemplates().subscribe(templates => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
  }

  getCategoryName(categoryID: number): string {
    return this.categoryService.getCategoryNameById(categoryID)||"nothing";
  }

  countCardsByTemplateId(templateID: number): number {
    return this.cardsService.getCardsByTemplateId(templateID).length;
  }

  addTemplate(): void {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        
        this.templateService.addTemplate(result).subscribe({
          next: () => {
            this.getAllTemplates();
            Swal.fire({
              icon: 'success',
              title: 'הרקע נוסף בהצלחה',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת הרקע.'
            });
          }
        });
      }
    });
  }

  editTemplate(template: Template): void {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '400px',
      data: { mode: 'edit', template }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templateService.updateTemplate(template.templateID, result).subscribe({
          next: () => {
            this.getAllTemplates();
            Swal.fire({
              icon: 'success',
              title: 'הרקע עודכן בהצלחה',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת עדכון הרקע.'
            });
          }
        });
      }
    });
  }

  deleteTemplate(templateID: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: "לא תוכל לשחזר את הרקע לאחר מחיקה!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן, מחק את הרקע!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.templateService.deleteTemplate(templateID).subscribe({
          next: () => {
            this.getAllTemplates();
            Swal.fire({
              icon: 'success',
              title: 'נמחק!',
              text: 'המשתמש נמחק בהצלחה.'
            })
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת מחיקת הרקע.'
            });
          }
        });
      }
    });
  }
  
  getTemplateFullURL(imageURL: string):string{
    return environment.startImageURL+imageURL;
  }

  private filterTemplates(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredTemplates = this.templates.filter(template =>
      template.templateName.toLowerCase().includes(lower)
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
   * Calculate usage percentage for the template
   */
  getUsagePercentage(templateId: number): number {
    // Get the count of cards using this template
    const count = this.countCardsByTemplateId(templateId);
    
    // Get the maximum count across all templates for comparison
    const maxCount = this.getMaxCardCount();
    
    // Calculate percentage (with a minimum of 5% for visibility)
    return maxCount === 0 ? 5 : Math.max(5, Math.min(100, Math.round((count / maxCount) * 100)));
  }
  
  /**
   * Get the maximum card count across all templates
   */
  private getMaxCardCount(): number {
    if (!this.filteredTemplates || this.filteredTemplates.length === 0) return 1;
    
    let maxCount = 0;
    this.filteredTemplates.forEach(template => {
      const count = this.countCardsByTemplateId(template.templateID);
      if (count > maxCount) maxCount = count;
    });
    
    return maxCount === 0 ? 1 : maxCount; // Avoid division by zero
  }
}
