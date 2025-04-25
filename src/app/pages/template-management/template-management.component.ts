import { Component, OnInit } from '@angular/core';
import { Template, TemplateService } from '../../services/template.service';
import Swal from 'sweetalert2';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-template-management',
  standalone: true,
  imports: [],
  templateUrl: './template-management.component.html',
  styleUrl: './template-management.component.scss'
})
export class TemplateManagementComponent implements OnInit {
  templates: Template[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  newTemplateName = '';
  newCategoryID = 1;

  constructor(private templateService: TemplateService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadCategories();
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error: any) => {
        console.error('Error loading categories:', error);
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
    formData.append('CategoryID', this.newCategoryID.toString()); // Assuming CategoryID is a number, convert it to string
      // this.newCategoryID.toString()
    // );
    formData.append('UserID', '1'); // Assuming user ID is 1 for now
    formData.append('ImageFile', this.selectedFile);

    // console.log(formData);
    
    this.templateService.addTemplate(formData).subscribe(() => {
      this.loadTemplates();
      this.selectedFile = null;
      this.newTemplateName = '';
      this.newCategoryID = 1;
    });
  }

  changeCategory(template: Template): void {
    const categoryName = this.getCategoryName(template.categoryID);
    
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: `האם אתה בטוח שברצונך לשנות את הקטגוריה של הרקע "${template.templateName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, שנה!',
      cancelButtonText: 'לא, ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showCategorySelectionDialog(template);
      }
    });
  }

  showCategorySelectionDialog(template: Template): void {
    Swal.fire({
      title: 'בחר קטגוריה חדשה',
      input: 'select',
      inputOptions: this.getCategoryOptions(),
      inputPlaceholder: 'בחר קטגוריה',
      showCancelButton: true,
      confirmButtonText: 'שנה',
      cancelButtonText: 'ביטול',
      preConfirm: (categoryID: number) => {
        if (categoryID) {
          console.log('here in updating...');
          this.updateTemplateCategory(template.templateID, categoryID);
        }
      }
    });
  }

  getCategoryOptions(): { [key: number]: string } {
    const options: { [key: number]: string } = {};
    this.categories.forEach(category => {
      options[category.categoryID] = category.categoryName;
    });
    return options;
  }

  updateTemplateCategory(templateID: number, categoryID: number): void {
    const updatedTemplate: Partial<Template> = { categoryID };
    this.templateService.updateTemplate(templateID, updatedTemplate).subscribe(() => {
      this.loadTemplates();
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

  getCategoryName(categoryID: number): string {
    const category = this.categories.find(cat => cat.categoryID === categoryID);
    return category ? category.categoryName : 'לא מוגדר';
  }

  trackByTemplateID(index: number, template: Template): number {
    return template.templateID;
  }
}

