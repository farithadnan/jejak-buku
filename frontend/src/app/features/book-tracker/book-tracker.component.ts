import { Component, ViewChild, ElementRef, AfterViewChecked, QueryList, ViewChildren, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, BookService } from '../../shared/services/book.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { debounceTime, Subject } from 'rxjs';
import { BookModalComponent } from './book-modal/book-modal.component';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../shared/services/storage.service';

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
  allGenres: string[] = [];

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
  @ViewChild('importFile') importFile!: ElementRef<HTMLInputElement>;

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

  // Add view mode property
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
    private toastr: ToastrService,
    private storageService: StorageService  // Add this
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
    // Load view mode preference using service
    const savedViewMode = this.storageService.getItem('bookViewMode') as 'grid' | 'list';
    if (savedViewMode) {
      this.viewMode = savedViewMode;
    }

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
      ...(this.status ? { status: this.status } : {}),
      ...(this.genreFilter ? { genre: this.genreFilter } : {})
    };

    this.bookService.getBooks(params).subscribe({
      next: (res) => {
        this.books = res.books;
        this.totalPages = res.totalPages;
        this.totalResults = res.totalBooks;
        this.extractGenresFromBooks();
      },
      error: () => {
        this.books = [];
        this.totalPages = 1;
        this.totalResults = 0;
        this.toastr.error('Failed to load books');
      }
    });
  }

  private extractGenresFromBooks() {
    // Get all genres from all books (not just filtered results)
    // We need to make a separate call to get all books for genre extraction
    this.bookService.getBooks({ limit: 1000 }).subscribe({
      next: (res) => {
        const genresSet = new Set<string>();
        res.books.forEach(book => {
          if (book.genres) {
            book.genres.forEach(genre => genresSet.add(genre));
          }
        });
        this.allGenres = Array.from(genresSet).sort();
      },
      error: () => {
        // Fallback to current books if all books call fails
        const genresSet = new Set<string>();
        this.books.forEach(book => {
          if (book.genres) {
            book.genres.forEach(genre => genresSet.add(genre));
          }
        });
        this.allGenres = Array.from(genresSet).sort();
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

  onModalCancel() {
    this.showModal = false;
  }

  onModalDelete(book: Partial<Book>) {
    if (book.id) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.showModal = false;
        this.fetchBooks();
        this.toastr.success('Book deleted successfully!');
      });
    }
  }

  onStatusChange(value: string, book: Book) {
    book.status = value as 'planned' | 'reading' | 'completed';
    if (book.id) {
      this.bookService.updateBook(book.id, { status: book.status }).subscribe({
        next: () => {
          this.toastr.success('Status updated successfully!');
          this.editingStatusIndex = null;
        },
        error: () => {
          this.toastr.error('Failed to update status');
          this.editingStatusIndex = null;
        }
      });
    }
  }

  onRatingChange(value: string, book: Book) {
    book.rating = value === '' || value === 'undefined' ? undefined : Number(value);
    if (book.id) {
      this.bookService.updateBook(book.id, { rating: book.rating }).subscribe({
        next: () => {
          this.toastr.success('Rating updated successfully!');
          this.editingRatingIndex = null;
        },
        error: () => {
          this.toastr.error('Failed to update rating');
          this.editingRatingIndex = null;
        }
      });
    }
  }

  onNotesChange(value: string, book: Book) {
    book.notes = value;
    if (book.id) {
      this.bookService.updateBook(book.id, { notes: book.notes }).subscribe({
        next: () => {
          this.toastr.success('Notes updated successfully!');
          this.editingNotesIndex = null;
        },
        error: () => {
          this.toastr.error('Failed to update notes');
          this.editingNotesIndex = null;
        }
      });
    }
  }

  onCurrentPageChange(value: string, book: Book) {
    const currentPage = parseInt(value) || 0;
    book.currentPage = currentPage;
    if (book.id) {
      this.bookService.updateBook(book.id, { currentPage: book.currentPage }).subscribe({
        next: () => {
          this.toastr.success('Current page updated successfully!');
          this.editingCurrentPageIndex = null;
        },
        error: () => {
          this.toastr.error('Failed to update current page');
          this.editingCurrentPageIndex = null;
        }
      });
    }
  }

  onPagesChange(value: string, book: Book) {
    const pages = parseInt(value) || 0;
    book.pages = pages;
    if (book.id) {
      this.bookService.updateBook(book.id, { pages: book.pages }).subscribe({
        next: () => {
          this.toastr.success('Total pages updated successfully!');
          this.editingPagesIndex = null;
        },
        error: () => {
          this.toastr.error('Failed to update total pages');
          this.editingPagesIndex = null;
        }
      });
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

  onFilterChange() {
    this.currentPage = 1;
    this.fetchBooks();
  }

  // Add method to set view mode
  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
    this.storageService.setItem('bookViewMode', mode);
  }

  // Update the toggleViewMode method
  toggleViewMode() {
    const newMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.setViewMode(newMode);
  }

  // Add method to handle notes keydown with proper typing
  onNotesKeyDown(event: KeyboardEvent, notes: string, book: Book) {
      if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this.onNotesChange(notes, book);
    }
  }

  exportBooks() {
    this.bookService.getBooks({ limit: 10000 }).subscribe({
      next: (res) => {
        const dataStr = JSON.stringify(res.books, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `jejak-buku-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.toastr?.error('Failed to export books');
      }
    });
  }

  importBooks() {
    this.importFile.nativeElement.value = '';
    this.importFile.nativeElement.click();
  }

  onImportFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedBooks: Partial<Book>[] = JSON.parse(reader.result as string);
        if (!Array.isArray(importedBooks)) throw new Error('Invalid backup format');
        let importedCount = 0;
        importedBooks.forEach(book => {
          // Remove id if present to avoid conflicts
          const { id, ...bookData } = book;
          this.bookService.createBook(bookData as Book).subscribe({
            next: () => {
              importedCount++;
              if (importedCount === importedBooks.length) {
                this.fetchBooks();
                this.toastr.success(`Imported ${importedCount} books!`);
              }
            },
            error: () => {
              this.toastr.error('Failed to import some books');
            }
          });
        });
      } catch (err) {
        this.toastr.error('Invalid backup file');
      }
    };
    reader.readAsText(file);
  }
}
