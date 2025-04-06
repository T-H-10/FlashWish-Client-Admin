import { Component, OnInit } from '@angular/core';
import { Statistics, StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // usersCount: number = 0;
  // greetingsCount: number = 0;
  // backgroundsCount: number = 0;
  // recentActivities: string[] = [];

  statistics: Statistics = {
    usersCount: 0,
    greetingsCount: 0,
    templatesCount: 0,
    greetingMessagesCount: 0,
    categoriesCount: 0
  };
  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(
      (data) => {
        this.statistics = data;
      },
      (error) => {
        console.error('Error loading statistics:', error);
      }
    );
    // סימולציה של נתונים מהשרת
    // this.usersCount = 120;
    // this.greetingsCount = 340;
    // this.backgroundsCount = 45;
    // this.recentActivities = [
    //   'משתמש חדש נרשם למערכת',
    //   'נוספה ברכה חדשה',
    //   'משתמש עדכן תמונת רקע'
    // ];
  }
}
