import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTrackerComponent } from './book-tracker.component';

describe('BookTrackerComponent', () => {
  let component: BookTrackerComponent;
  let fixture: ComponentFixture<BookTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
