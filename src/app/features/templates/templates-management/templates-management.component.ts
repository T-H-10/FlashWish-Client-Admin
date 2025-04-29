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
@Component({
  selector: 'app-templates-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './templates-management.component.html',
  styleUrl: './templates-management.component.css'
})
export class TemplatesManagementComponent implements OnInit {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchControl = new FormControl('');

  constructor(private templateService: TemplateService, private dialog: MatDialog) { }

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

  addTemplate(): void {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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

  private filterTemplates(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredTemplates = this.templates.filter(template =>
      template.templateName.toLowerCase().includes(lower)
    );
  }
}
