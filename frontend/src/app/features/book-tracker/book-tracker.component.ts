import { Component, ViewChild, ElementRef, AfterViewChecked, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../shared/services/book.service';

interface BookCard extends Book {
  imageUrl?: string;
  rating?: number;
  notes?: string;
  status: 'planned' | 'reading' | 'completed';
  pages?: number;
  currentPage?: number;
}

@Component({
  selector: 'app-book-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './book-tracker.component.html',
  styleUrls: ['./book-tracker.component.scss']
})
export class BookTrackerComponent implements AfterViewChecked {
  loading = false;
  search = '';
  status = '';

  hoveredIndex: number | null = null;
  editingRatingIndex: number | null = null;
  editingStatusIndex: number | null = null;
  editingNotesIndex: number | null = null;
  editingPagesIndex: number | null = null;
  editingCurrentPageIndex: number | null = null;

  @ViewChild('notesInput') notesInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChildren('pagesInput') pagesInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('currentPageInput') currentPageInputs!: QueryList<ElementRef<HTMLInputElement>>;

  books: BookCard[] = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      imageUrl: 'https://covers.openlibrary.org/b/id/10523362-L.jpg',
      status: 'completed',
      rating: 5,
      notes: 'Great book for building habits. Highly recommended!',
      pages: 320,
      currentPage: 320,
      userId: 1
    },
    {
      id: 2,
      title: 'Deep Work',
      author: 'Cal Newport',
      imageUrl: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
      status: 'reading',
      rating: 4,
      notes: 'Focus and productivity tips.',
      pages: 320,
      currentPage: 320,
      userId: 1
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      imageUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
      status: 'planned',
      notes: 'Classic for software developers.',
      pages: 320,
      currentPage: 320,
      userId: 1
    },
    {
      id: 4,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      imageUrl: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
      status: 'completed',
      rating: 5,
      notes: 'Must-read for every programmer.',
      pages: 320,
      currentPage: 320,
      userId: 1
    },
    {
      id: 5,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      imageUrl: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
      status: 'completed',
      rating: 5,
      notes: 'Must-read for every programmer.',
      pages: 320,
      currentPage: 320,
      userId: 1
    }
  ];

  ngAfterViewChecked() {
    if (this.editingNotesIndex !== null && this.notesInput) {
      this.notesInput.nativeElement.focus();
    }
    if (this.editingPagesIndex !== null && this.pagesInputs) {
      const input = this.pagesInputs.toArray()[this.editingPagesIndex];
      if (input) input.nativeElement.focus();
    }
    if (this.editingCurrentPageIndex !== null && this.currentPageInputs) {
      const input = this.currentPageInputs.toArray()[this.editingCurrentPageIndex];
      if (input) input.nativeElement.focus();
    }
  }

  openCreateModal() {}
  openEditModal(book: BookCard) {}
  openDeleteModal(book: BookCard) {}

  onRatingChange(value: string, book: BookCard) {
    book.rating = value === 'none' ? undefined : Number(value);
  }
}
