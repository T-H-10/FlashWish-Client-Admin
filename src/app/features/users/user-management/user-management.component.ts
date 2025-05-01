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

  private filterUsers(searchTerm: string): void {
    const lower = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.userName.toLowerCase().includes(lower) || user.email.toLowerCase().includes(lower)
    );
  }
}
