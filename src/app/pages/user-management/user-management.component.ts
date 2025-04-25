import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  updateUser(user: User): void {
    if (confirm('האם אתה בטוח שברצונך לשנות את המשתמש הזה?')) {
    this.userService.updateUser(user).subscribe({
      next: (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.loadUsers(); // Reload users after update
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }
  //  else {
  //   console.log(this.users);
    
  //   this.users=this.users;
  // }
  }

  deleteUser(userId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את המשתמש הזה?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          console.log('User deleted:', userId);
          this.loadUsers(); // Reload users after deletion
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
