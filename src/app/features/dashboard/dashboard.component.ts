import { Component, OnInit } from '@angular/core';
import { Statistics } from '../../models/statistics.model';
import { StatisticsService } from '../../services/statistics/statistics.service';
import { CounterComponent } from "../../components/counter/counter.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CounterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  statistics: Statistics = {
    usersCount: 0,
    categoriesCount: 0,
    templatesCount: 0,
    greetingMessagesCount: 0,
    greetingsCount: 0
  };

  constructor(
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
      this.statisticsService.getStatistics().subscribe(
        (response) => {
          this.statistics = response;
        },
        (error) => {
          console.error('Error loading statistics:', error);
        }
      );
  }
}
