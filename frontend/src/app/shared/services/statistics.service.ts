import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReadingStatistics {
  // Summary stats
  totalBooks: number;
  booksByStatus: {
    planned: number;
    reading: number;
    completed: number;
  };
  totalPagesRead: number;
  averageRating: number;
  
  // Genre distribution
  topGenres: {
    genre: string;
    count: number;
  }[];
  
  // Monthly reading trend (last 6 months)
  monthlyTrend: {
    month: string;
    completed: number;
  }[];
  
  // Recent achievements
  thisMonthCompleted: number;
  thisYearCompleted: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<ReadingStatistics> {
    return this.http.get<ReadingStatistics>(this.apiUrl);
  }
}
