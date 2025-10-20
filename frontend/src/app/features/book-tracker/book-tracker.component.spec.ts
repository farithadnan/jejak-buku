import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookTrackerComponent } from './book-tracker.component';
import { BookService } from '../../shared/services/book.service';
import { StorageService } from '../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { Book } from '../../shared/services/book.service';

describe('BookTrackerComponent', () => {
  let component: BookTrackerComponent;
  let fixture: ComponentFixture<BookTrackerComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getBooks', 'createBook', 'updateBook', 'deleteBook'
    ]);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);

    // Set default return value for getBooks
    bookServiceSpy.getBooks.and.returnValue(of({
      books: [],
      totalBooks: 0,
      totalPages: 1,
      currentPage: 1
    }));

    await TestBed.configureTestingModule({
      imports: [BookTrackerComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch books on init', () => {
    const mockBook: Book = { id: 1, title: 'Test', author: 'Author', status: 'planned' };
    const mockResponse = {
      books: [mockBook],
      totalBooks: 1,
      totalPages: 1,
      currentPage: 1
    };
    bookServiceSpy.getBooks.and.returnValue(of(mockResponse));
    component.fetchBooks();
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
    expect(component.books.length).toBe(1);
  });

  it('should handle fetchBooks error', () => {
    bookServiceSpy.getBooks.and.returnValue(throwError(() => new Error('API Error')));
    component.fetchBooks();
    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to load books');
    expect(component.books.length).toBe(0);
  });

  it('should open create modal', () => {
    component.openCreateModal();
    expect(component.showModal).toBeTrue();
    expect(component.modalMode).toBe('create');
  });

  it('should open edit modal', () => {
    const book: Book = { id: 1, title: 'Test', author: 'Author', status: 'planned' };
    component.openEditModal(book);
    expect(component.showModal).toBeTrue();
    expect(component.modalMode).toBe('edit');
    expect(component.editingBook.id).toBe(1);
  });

  it('should save book on modal save (create)', () => {
    component.modalMode = 'create';
    bookServiceSpy.createBook.and.returnValue(of({ id: 1, title: 'Test', author: 'Author', status: 'planned' }));
    component.onModalSave({ title: 'Test', author: 'Author', status: 'planned' });
    expect(bookServiceSpy.createBook).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith('Book created successfully!');
  });

  it('should save book on modal save (edit)', () => {
    component.modalMode = 'edit';
    component.editingBook = { id: 1, title: 'Test', author: 'Author', status: 'planned' };
    bookServiceSpy.updateBook.and.returnValue(of({ id: 1, title: 'Test', author: 'Author', status: 'planned' }));
    component.onModalSave({ id: 1, title: 'Test', author: 'Author', status: 'planned' });
    expect(bookServiceSpy.updateBook).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(toastrSpy.success).toHaveBeenCalledWith('Book updated successfully!');
  });

  it('should delete book on modal delete', () => {
    component.editingBook = { id: 1 };
    bookServiceSpy.deleteBook.and.returnValue(of({ message: 'Book deleted' }));
    component.onModalDelete(component.editingBook);
    expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith(1);
    expect(toastrSpy.success).toHaveBeenCalledWith('Book deleted successfully!');
  });

  it('should toggle view mode and save to storage', () => {
    storageSpy.setItem.and.stub();
    component.viewMode = 'grid';
    component.toggleViewMode();
    expect(component.viewMode).toBe('list');
    expect(storageSpy.setItem).toHaveBeenCalledWith('bookViewMode', 'list');
  });
});
