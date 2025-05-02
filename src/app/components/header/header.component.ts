import { Component, NgModule, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen:boolean = true;
  
  toggleMenu() {
    this.isMenuOpen=!this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen=false;
  }

  // showMenu() {
  //   return this.isMenuOpen;
  // }
  logout() {
    localStorage.removeItem('authToken');
    // sessionStorage.removeItem('user');
    // window.location.reload();
  }

}
