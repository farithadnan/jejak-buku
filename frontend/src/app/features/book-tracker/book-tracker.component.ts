import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../shared/services/book.service';

@Component({
  selector: 'app-book-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './book-tracker.component.html',
  styleUrls: ['./book-tracker.component.scss']
})
export class BookTrackerComponent {
  loading = false;
  books: Book[] = []; // Fill with mock data for now
  search = '';
  status = '';
  openCreateModal() {}
  openEditModal(book: Book) {}
  openDeleteModal(book: Book) {}
}
