import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usersCount: number = 0;
  greetingsCount: number = 0;
  backgroundsCount: number = 0;
  recentActivities: string[] = [];

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // סימולציה של נתונים מהשרת
    this.usersCount = 120;
    this.greetingsCount = 340;
    this.backgroundsCount = 45;
    // this.recentActivities = [
    //   'משתמש חדש נרשם למערכת',
    //   'נוספה ברכה חדשה',
    //   'משתמש עדכן תמונת רקע'
    // ];
  }
}
