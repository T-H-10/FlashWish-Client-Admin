import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
     SidebarComponent,
     RouterOutlet,
     RouterLink,
     RouterLinkActive
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
