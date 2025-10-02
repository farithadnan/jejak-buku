import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../shared/services/book.service';

interface BookCard extends Book {
  imageUrl?: string;
  rating?: number;
  notes?: string;
  status: 'planned' | 'reading' | 'completed';
}

@Component({
  selector: 'app-book-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './book-tracker.component.html',
  styleUrls: ['./book-tracker.component.scss']
})
export class BookTrackerComponent {
  loading = false;
  search = '';
  status = '';

  editingRatingIndex: number | null = null; // <-- Add this property

  books: BookCard[] = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      imageUrl: 'https://covers.openlibrary.org/b/id/10523362-L.jpg',
      status: 'completed',
      rating: 5,
      notes: 'Great book for building habits. Highly recommended!',
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
      userId: 1
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      imageUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
      status: 'planned',
      notes: 'Classic for software developers.',
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
      userId: 1
    }
  ];

  openCreateModal() {}
  openEditModal(book: BookCard) {}
  openDeleteModal(book: BookCard) {}
}
