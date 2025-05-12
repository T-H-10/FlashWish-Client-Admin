import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    Swal.fire({
      title: 'האם אתה בטוח?',
      text: "לאחר שתצא, תצטרך להתחבר שוב.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, התנתק!',
      cancelButtonText: 'לא, נשאר',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout()
      }
    });
  }
}
