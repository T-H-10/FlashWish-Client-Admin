import { Component, OnInit } from '@angular/core';
import { Template, TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-management',
  standalone: true,
  imports: [],
  templateUrl: './template-management.component.html',
  styleUrl: './template-management.component.css'
})
export class TemplateManagementComponent implements OnInit {
  templates: Template[] = [];
  selectedFile: File | null = null;
  newTemplateName = '';
  newCategoryID = 1;

  constructor(private templateService: TemplateService) { }

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getTemplates().subscribe(
      (data: Template[]) => {
        this.templates = data;
      },
      (error: any) => {
        console.error('Error loading templates:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addTemplate(): void {
    if (!this.selectedFile || this.newTemplateName)
      return;

    const formData = new FormData();
    formData.append('TemplateName', this.newTemplateName);
    formData.append('CategoryID', this.newCategoryID.toString());
    formData.append('UserID', '1'); // Assuming user ID is 1 for now
    formData.append('ImageFile', this.selectedFile);

    this.templateService.addTemplate(formData).subscribe(() => {
      this.loadTemplates();
      this.selectedFile = null;
      this.newTemplateName = '';
      this.newCategoryID = 1;
    });
  }

  deleteTemplate(templateID: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את הרקע הזה?')) {
      this.templateService.deleteTemplate(templateID).subscribe(() => {
        this.templates = this.templates.filter(template => template.templateID !== templateID);
        // this.loadTemplates();
      });
    }
  }
}
