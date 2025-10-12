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
}

@Injectable({ providedIn: 'root' })
export class BookService {
  // Need to add environment variable for API URL
  // atm more like endpoint than the domain/base path
  // Need also establish the return types properly, do these after finish the ui, might need to update the backend as well
  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'planned' | 'reading' | 'completed';
    userId?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) httpParams = httpParams.set(key, value as any);
      });
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
