import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { StatisticsService } from '../../shared/services/statistics.service';
import { LoadingService } from '../../shared/services/loading.service';
import { of } from 'rxjs';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;

  beforeEach(async () => {
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getStatistics']);

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceSpy },
        LoadingService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load statistics on init', () => {
    const mockStats = {
      totalBooks: 10,
      booksByStatus: { planned: 3, reading: 2, completed: 5 },
      totalPagesRead: 1500,
      averageRating: 4.2,
      topGenres: [{ genre: 'Fiction', count: 5 }],
      monthlyTrend: [{ month: 'Jan', completed: 2 }],
      thisMonthCompleted: 2,
      thisYearCompleted: 8
    };

    statisticsServiceSpy.getStatistics.and.returnValue(of(mockStats));

    component.ngOnInit();

    expect(component.stats).toEqual(mockStats);
    expect(statisticsServiceSpy.getStatistics).toHaveBeenCalled();
  });

  it('should calculate completion percentage correctly', () => {
    component.stats = {
      totalBooks: 10,
      booksByStatus: { planned: 3, reading: 2, completed: 5 },
      totalPagesRead: 1500,
      averageRating: 4.2,
      topGenres: [],
      monthlyTrend: [],
      thisMonthCompleted: 2,
      thisYearCompleted: 8
    };

    expect(component.getCompletionPercentage()).toBe(50);
  });

  it('should return 0 for completion percentage when no books', () => {
    component.stats = {
      totalBooks: 0,
      booksByStatus: { planned: 0, reading: 0, completed: 0 },
      totalPagesRead: 0,
      averageRating: 0,
      topGenres: [],
      monthlyTrend: [],
      thisMonthCompleted: 0,
      thisYearCompleted: 0
    };

    expect(component.getCompletionPercentage()).toBe(0);
  });
});
