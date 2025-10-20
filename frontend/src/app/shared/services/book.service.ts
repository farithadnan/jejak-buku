import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { environment } from '../../../environments/environment';

export interface Book {
  id?: number;
  title: string;
  author: string;
  status: 'planned' | 'reading' | 'completed';
  rating?: number;
  notes?: string;
  imageUrl?: string;
  pages?: number;
  currentPage?: number;
  description?: string;
  publishedDate?: string;
  genres?: string[];
  isbn?: string;
  startedDate?: string;
  completedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookListResponse {
  books: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private loadingService = inject(LoadingService);

  constructor(private http: HttpClient) {}

  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'planned' | 'reading' | 'completed';
    genre?: string;
  }): Observable<BookListResponse> {
    this.loadingService.show();

    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) httpParams = httpParams.set(key, value as any);
      });
    }

    return this.http.get<BookListResponse>(this.apiUrl, { params: httpParams })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getBookById(id: number): Observable<Book> {
    this.loadingService.show();
    return this.http.get<Book>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  createBook(book: Book): Observable<Book> {
    this.loadingService.show();
    const payload = { ...book, genres: book.genres ?? [] };
    return this.http.post<Book>(this.apiUrl, payload)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    this.loadingService.show();
    const payload = { ...book, genres: book.genres ?? [] };
    return this.http.put<Book>(`${this.apiUrl}/${id}`, payload)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  deleteBook(id: number): Observable<{ message: string }> {
    this.loadingService.show();
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
