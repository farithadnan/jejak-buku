import { TestBed } from '@angular/core/testing';
import { BookService, Book, BookListResponse } from './book.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LoadingService } from './loading.service';

describe('BookService', () => {
  let service: BookService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let loadingSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    // Use real LoadingService
    TestBed.configureTestingModule({
      providers: [
        BookService,
        { provide: HttpClient, useValue: httpSpy },
        LoadingService // <-- Use the real service
      ]
    });

    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getBooks and return BookListResponse', (done) => {
    const mockResponse: BookListResponse = {
      books: [{ id: 1, title: 'Test', author: 'Author', status: 'planned' }],
      totalBooks: 1,
      totalPages: 1,
      currentPage: 1
    };
    httpSpy.get.and.returnValue(of(mockResponse));

    service.getBooks({ page: 1, limit: 10 }).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(httpSpy.get).toHaveBeenCalled();


      done();
    });
  });

  it('should call getBookById and return Book', (done) => {
    const mockBook: Book = { id: 1, title: 'Test', author: 'Author', status: 'planned' };
    httpSpy.get.and.returnValue(of(mockBook));

    service.getBookById(1).subscribe(res => {
      expect(res).toEqual(mockBook);
      expect(httpSpy.get).toHaveBeenCalledWith(jasmine.stringMatching(/\/books\/1$/));


      done();
    });
  });

  it('should call createBook and return Book', (done) => {
    const newBook: Book = { title: 'New', author: 'Author', status: 'planned' };
    const createdBook: Book = { id: 2, ...newBook };
    httpSpy.post.and.returnValue(of(createdBook));

    service.createBook(newBook).subscribe(res => {
      expect(res).toEqual(createdBook);
      expect(httpSpy.post).toHaveBeenCalled();


      done();
    });
  });

  it('should call updateBook and return Book', (done) => {
    const updatedBook: Book = { id: 1, title: 'Updated', author: 'Author', status: 'reading' };
    httpSpy.put.and.returnValue(of(updatedBook));

    service.updateBook(1, { title: 'Updated', status: 'reading' }).subscribe(res => {
      expect(res).toEqual(updatedBook);
      expect(httpSpy.put).toHaveBeenCalledWith(jasmine.stringMatching(/\/books\/1$/), jasmine.any(Object));


      done();
    });
  });

  it('should call deleteBook and return message', (done) => {
    const mockResponse = { message: 'Book deleted' };
    httpSpy.delete.and.returnValue(of(mockResponse));

    service.deleteBook(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(httpSpy.delete).toHaveBeenCalledWith(jasmine.stringMatching(/\/books\/1$/));


      done();
    });
  });
});