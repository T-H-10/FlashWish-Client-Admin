import { Component, HostListener, OnInit } from '@angular/core';
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
  styleUrls: ['./header.component.css','./header2.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = true;
  isScrolled: boolean = false;
  activeNavItem: number = -1;
  
  cosmicParticles = Array(15).fill(0).map((_, i) => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check initial scroll position
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 10;
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  
  setActiveNavItem(index: number): void {
    this.activeNavItem = index;
  }
  
  resetActiveNavItem(): void {
    this.activeNavItem = -1;
  }
  
  getNavItemState(index: number): string {
    return this.activeNavItem === index ? 'active' : 'inactive';
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
