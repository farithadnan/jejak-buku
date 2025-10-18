import { Component, ViewChild, ElementRef, AfterViewChecked, QueryList, ViewChildren, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, BookService } from '../../shared/services/book.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { debounceTime, Subject } from 'rxjs';
import { BookModalComponent } from './book-modal/book-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, BookModalComponent, LoadingSpinner],
  templateUrl: './book-tracker.component.html',
  styleUrls: ['./book-tracker.component.scss']
})
export class BookTrackerComponent implements AfterViewChecked, OnInit {
  private loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;

  // Remove the local loading property as we're using the service now
  search = '';
  status = '';
  genreFilter = '';
  showFilters = false;
  allGenres: string[] = ['Self-Help', 'Productivity', 'Programming', 'Software Development', 'Agile', 'Best Practices', 'Refactoring', 'Design Patterns'];

  hoveredIndex: number | null = null;
  hoveredGenresIndex: number | null = null;
  editingRatingIndex: number | null = null;
  editingStatusIndex: number | null = null;
  editingNotesIndex: number | null = null;
  editingPagesIndex: number | null = null;
  editingCurrentPageIndex: number | null = null;

  @ViewChild('notesInput') notesInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChildren('pagesInput') pagesInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('currentPageInput') currentPageInputs!: QueryList<ElementRef<HTMLInputElement>>;

  books: Book[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  isMobile = window.innerWidth < 400;
  pageSize = 10;

  searchTerm$ = new Subject<string>();

  showModal = false;
  modalMode: 'edit' | 'create' = 'create';
  editingBook: Partial<Book> = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
    private toastr: ToastrService
  ) {}

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxButtons = this.isMobile ? 3 : 7;
    if (this.totalPages <= maxButtons) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= Math.ceil(maxButtons / 2)) {
        for (let i = 1; i <= maxButtons - 1; i++) pages.push(i);
        pages.push('...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - Math.floor(maxButtons / 2)) {
        pages.push(1, '...');
        for (let i = this.totalPages - (maxButtons - 2); i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...', this.currentPage, '...', this.totalPages);
      }
    }
    return pages;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalResults);
  }

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

  ngOnInit() {
    this.searchTerm$.pipe(debounceTime(300)).subscribe(term => {
      this.search = term;
      this.currentPage = 1;
      this.fetchBooks();
    });
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 500;
    });

    // Fetch books on initial load
    this.fetchBooks();
  }

  fetchBooks() {
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.search,
      ...(this.status ? { status: this.status } : {})
    };

    this.bookService.getBooks(params).subscribe({
      next: (res) => {
        this.books = res.books;
        this.totalPages = res.totalPages;
        this.totalResults = res.totalBooks;
      },
      error: () => {
        this.books = [];
        this.totalPages = 1;
        this.totalResults = 0;
        this.toastr.error('Failed to load books');
      }
    });
  }

  openCreateModal() {
    this.editingBook = {};
    this.modalMode = 'create';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(book: Book) {
    this.editingBook = { ...book };
    this.modalMode = 'edit';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  onModalSave(book: Partial<Book>) {
    if (this.modalMode === 'create') {
      this.bookService.createBook(book as Book).subscribe(() => {
        this.showModal = false;
        this.fetchBooks();
        this.toastr.success('Book created successfully!');
      });
    } else if (this.modalMode === 'edit' && book.id) {
      this.bookService.updateBook(book.id, book).subscribe(() => {
        this.showModal = false;
        this.fetchBooks();
        this.toastr.success('Book updated successfully!');
      });
    }
  }

  onModalDelete(book: Partial<Book>) {
    if (book.id) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.showModal = false;
        this.fetchBooks();
      });
    }
  }

  onRatingChange(value: string, book: Book) {
    book.rating = value === 'none' ? undefined : Number(value);
    if (book.id) {
      this.bookService.updateBook(book.id, { rating: book.rating }).subscribe(() => this.fetchBooks());
    }
  }

  goToPage(page: number) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBooks();
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/400x600?text=No+Cover';
  }
}
