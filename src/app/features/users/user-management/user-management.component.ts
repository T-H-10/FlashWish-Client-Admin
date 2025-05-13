import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { CardsService } from '../../../services/cards/cards.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-management',
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
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchControl = new FormControl('');

  constructor(
    private userService: UserService,
    private dialog: MatDialog, 
    private cardsServise: CardsService) { }


  ngOnInit(): void {
    this.getAllUsers();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterUsers(value || '');
    });
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  countCardsByUserId(userID: number): number {
    return this.cardsServise.getCardsByUserId(userID).length;
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe({
          next: () => {
            this.getAllUsers();
            Swal.fire({
              icon: 'success',
              title: 'המשתמש נוסף בהצלחה',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת המשתמש.'
            });
          }
        });
      }
    });
  }

  isAdmin(user: any): boolean {
    return user.roles.includes('Admin');
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);

        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.getAllUsers();
            Swal.fire({
              icon: 'success',
              title: 'המשתמש עודכן בהצלחה',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת עדכון המשתמש.'
            });
          }
        });
      }
    });
  }

  deleteUser(userId: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: 'לא תוכל לשחזר את המשתמש לאחר המחיקה!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, מחק!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.getAllUsers();
            Swal.fire({
              icon: 'success',
              title: 'נמחק!',
              text: 'המשתמש נמחק בהצלחה.'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת מחיקת המשתמש.'
            });
          }
        });
      }
    });
  }

  addAdminRole(userId: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: 'האם אתה בטוח שברצונך להוסיף את תפקיד המנהל למשתמש זה?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, הוסף!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.addAdminRole(userId).subscribe({
          next: () => {
            this.getAllUsers();
            Swal.fire({
              icon: 'success',
              title: 'תפקיד נוסף!',
              text: 'תפקיד המנהל נוסף בהצלחה.'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הוספת תפקיד המנהל.'
            });
          }
        });
      }
    });
  }
  removeAdminRole(userId: number): void {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: 'האם אתה בטוח שברצונך להסיר את תפקיד המנהל למשתמש זה?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, הסר!',
      cancelButtonText: 'בטל'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.removeAdminRole(userId).subscribe({
          next: () => {
            this.getAllUsers();
            Swal.fire({
              icon: 'success',
              title: 'תפקיד הוסר!',
              text: 'תפקיד המנהל הוסר בהצלחה.'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'אירעה שגיאה בעת הסרת תפקיד המנהל.'
            });
          }
        });
      }
    });
  }

  private filterUsers(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.userName.toLowerCase().includes(lower) || user.email.toLowerCase().includes(lower)
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
   * Get icon for user role
   */
  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'admin_panel_settings';
      case 'editor':
        return 'edit_note';
      case 'user':
        return 'person';
      default:
        return 'badge';
    }
  }
  
  /**
   * Calculate user activity percentage based on card count
   */
  getUserActivityPercentage(userId: number): number {
    // Get the count of cards created by this user
    const count = this.countCardsByUserId(userId);
    
    // Get the maximum count across all users for comparison
    const maxCount = this.getMaxCardCount();
    
    // Calculate percentage (with a minimum of 5% for visibility)
    return maxCount === 0 ? 5 : Math.max(5, Math.min(100, Math.round((count / maxCount) * 100)));
  }
  
  /**
   * Get the maximum card count across all users
   */
  private getMaxCardCount(): number {
    if (!this.filteredUsers || this.filteredUsers.length === 0) return 1;
    
    let maxCount = 0;
    this.filteredUsers.forEach(user => {
      const count = this.countCardsByUserId(user.id);
      if (count > maxCount) maxCount = count;
    });
    
    return maxCount === 0 ? 1 : maxCount; // Avoid division by zero
  }
}
