import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id?: number;
  title: string;
  author: string;
  status: 'planned' | 'reading' | 'completed';
  rating?: number;
  notes?: string;
  userId: number;
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
  createdBy?: number;
  updatedBy?: number;
}

export interface BookListResponse {
  books: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'planned' | 'reading' | 'completed';
    userId?: number;
  }): Observable<BookListResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) httpParams = httpParams.set(key, value as any);
      });
    }
    return this.http.get<BookListResponse>(this.apiUrl, { params: httpParams });
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    // Ensure genres is sent as array or stringified if needed
    const payload = { ...book, genres: book.genres ?? [] };
    return this.http.post<Book>(this.apiUrl, payload);
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    const payload = { ...book, genres: book.genres ?? [] };
    return this.http.put<Book>(`${this.apiUrl}/${id}`, payload);
  }

  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
