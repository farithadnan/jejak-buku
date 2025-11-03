import { TestBed } from '@angular/core/testing';
import { StatisticsService, ReadingStatistics } from './statistics.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });

    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getStatistics and return ReadingStatistics', (done) => {
    const mockStats: ReadingStatistics = {
      totalBooks: 10,
      booksByStatus: {
        planned: 3,
        reading: 2,
        completed: 5
      },
      totalPagesRead: 1500,
      averageRating: 4.2,
      topGenres: [
        { genre: 'Fiction', count: 5 },
        { genre: 'Science', count: 3 }
      ],
      monthlyTrend: [
        { month: 'Jan', completed: 2 },
        { month: 'Feb', completed: 3 }
      ],
      thisMonthCompleted: 2,
      thisYearCompleted: 8
    };

    httpSpy.get.and.returnValue(of(mockStats));

    service.getStatistics().subscribe(stats => {
      expect(stats).toEqual(mockStats);
      expect(httpSpy.get).toHaveBeenCalled();
      done();
    });
  });
});
