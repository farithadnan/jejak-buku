import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService, ReadingStatistics } from '../../shared/services/statistics.service';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  stats: ReadingStatistics | null = null;
  loading$;

  constructor(
    private statisticsService: StatisticsService,
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  getCompletionPercentage(): number {
    if (!this.stats) return 0;
    const total = this.stats.totalBooks;
    if (total === 0) return 0;
    return Math.round((this.stats.booksByStatus.completed / total) * 100);
  }

  getReadingPercentage(): number {
    if (!this.stats) return 0;
    const total = this.stats.totalBooks;
    if (total === 0) return 0;
    return Math.round((this.stats.booksByStatus.reading / total) * 100);
  }

  getMaxGenreCount(): number {
    if (!this.stats || this.stats.topGenres.length === 0) return 1;
    return Math.max(...this.stats.topGenres.map(g => g.count));
  }

  getGenreBarWidth(count: number): number {
    const max = this.getMaxGenreCount();
    return (count / max) * 100;
  }

  getMaxMonthlyCount(): number {
    if (!this.stats || this.stats.monthlyTrend.length === 0) return 1;
    return Math.max(...this.stats.monthlyTrend.map(m => m.completed));
  }

  getMonthBarHeight(count: number): number {
    const max = this.getMaxMonthlyCount();
    if (max === 0) return 0;
    return (count / max) * 100;
  }

  getBooksPerMonth(): number {
    if (!this.stats || this.stats.thisYearCompleted === 0) return 0;
    const currentMonth = new Date().getMonth() + 1; // 1-12
    return this.stats.thisYearCompleted / currentMonth;
  }
}
