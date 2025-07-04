import { Component, OnInit } from '@angular/core';
import { Statistics } from '../../models/statistics.model';
import { StatisticsService } from '../../services/statistics/statistics.service';
import { CounterComponent } from "../../layouts/counter/counter.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CounterComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css',  './dashboard2.component.css',  './dashboard3.component.css']
})
export class DashboardComponent implements OnInit {
  statistics: Statistics = {
    usersCount: 0,
    categoriesCount: 0,
    templatesCount: 0,
    greetingMessagesCount: 0,
    greetingsCount: 0,
    usersGrowthRate: 0,
    greetingsGrowthRate: 0,
    templatesGrowthRate: 0,
    greetingMessagesGrowthRate: 0,
    categoriesGrowthRate: 0
  };

  constructor(
    private statisticsService: StatisticsService
  ) { }

  // ngOnInit(): void {
  //   this.loadStatistics();
  // }
  currentDate = new Date();
  Math = Math; // Make Math available in the template
  chartHeights: string[]=[];
  // constructor() { }
  
  ngOnInit(): void {
    this.loadStatistics();
    this.generateChartHeights();
    // Update the time every second
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  generateChartHeights(){
    this.chartHeights = Array.from({length:7},()=>{
      const height = 20+this.Math.random()*60;
      return `${height}%`;
    })
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
