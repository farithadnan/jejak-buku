import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Book, BookListResponse } from './book.service';

// Sample hardcoded books for demo
const DEMO_BOOKS: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    status: 'completed',
    rating: 5,
    notes: 'A masterpiece of American literature',
    imageUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    pages: 180,
    currentPage: 180,
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    publishedDate: '1925-04-10',
    genres: ['Classic', 'Fiction', 'Romance'],
    isbn: '9780743273565',
    completedDate: '2024-11-10T10:30:00.000Z',
    createdAt: '2024-11-01T08:00:00.000Z'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    status: 'reading',
    rating: 4,
    imageUrl: 'https://covers.openlibrary.org/b/id/7222339-L.jpg',
    pages: 328,
    currentPage: 150,
    description: 'A dystopian social science fiction novel and cautionary tale.',
    publishedDate: '1949-06-08',
    genres: ['Dystopian', 'Science Fiction', 'Political'],
    isbn: '9780451524935',
    startedDate: '2024-11-12T14:00:00.000Z',
    createdAt: '2024-11-05T09:00:00.000Z'
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    status: 'completed',
    rating: 5,
    notes: 'Powerful and moving',
    imageUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    pages: 324,
    currentPage: 324,
    description: 'A gripping tale of racial injustice and childhood innocence.',
    publishedDate: '1960-07-11',
    genres: ['Classic', 'Fiction', 'Historical'],
    isbn: '9780061120084',
    completedDate: '2024-11-08T16:20:00.000Z',
    createdAt: '2024-10-28T10:00:00.000Z'
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    status: 'reading',
    rating: 4,
    imageUrl: 'https://covers.openlibrary.org/b/id/8235774-L.jpg',
    pages: 279,
    currentPage: 120,
    description: 'A romantic novel of manners.',
    publishedDate: '1813-01-28',
    genres: ['Romance', 'Classic', 'Fiction'],
    isbn: '9780141439518',
    startedDate: '2024-11-10T11:00:00.000Z',
    createdAt: '2024-11-02T12:00:00.000Z'
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    status: 'completed',
    rating: 5,
    notes: 'An adventure to remember!',
    imageUrl: 'https://covers.openlibrary.org/b/id/8486493-L.jpg',
    pages: 310,
    currentPage: 310,
    description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
    publishedDate: '1937-09-21',
    genres: ['Fantasy', 'Adventure', 'Classic'],
    isbn: '9780547928227',
    completedDate: '2024-11-05T09:15:00.000Z',
    createdAt: '2024-10-25T14:00:00.000Z'
  },
  {
    id: 6,
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    status: 'planned',
    imageUrl: 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
    pages: 223,
    description: 'The first novel in the Harry Potter series.',
    publishedDate: '1997-06-26',
    genres: ['Fantasy', 'Young Adult', 'Adventure'],
    isbn: '9780439708180',
    createdAt: '2024-11-13T08:00:00.000Z'
  },
  {
    id: 7,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    status: 'reading',
    rating: 3,
    imageUrl: 'https://covers.openlibrary.org/b/id/8482672-L.jpg',
    pages: 214,
    currentPage: 80,
    description: 'A story about teenage rebellion and alienation.',
    publishedDate: '1951-07-16',
    genres: ['Classic', 'Fiction', 'Coming-of-age'],
    isbn: '9780316769174',
    startedDate: '2024-11-13T15:00:00.000Z',
    createdAt: '2024-11-06T10:00:00.000Z'
  },
  {
    id: 8,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    status: 'planned',
    imageUrl: 'https://covers.openlibrary.org/b/id/8456543-L.jpg',
    pages: 1178,
    description: 'An epic high-fantasy novel.',
    publishedDate: '1954-07-29',
    genres: ['Fantasy', 'Adventure', 'Epic'],
    isbn: '9780544003415',
    createdAt: '2024-11-07T11:00:00.000Z'
  }
];

@Injectable({ providedIn: 'root' })
export class MockBookService {
  private books: Book[] = [...DEMO_BOOKS];
  private nextId = 9;

  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'planned' | 'reading' | 'completed';
    genre?: string;
    sortBy?: 'completedDate' | 'createdAt';
  }): Observable<BookListResponse> {
    let filteredBooks = [...this.books];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }

    if (params?.status) {
      filteredBooks = filteredBooks.filter(book => book.status === params.status);
    }

    if (params?.genre) {
      filteredBooks = filteredBooks.filter(book =>
        book.genres?.some(g => g.toLowerCase() === params.genre?.toLowerCase())
      );
    }

    // Apply sorting
    if (params?.sortBy === 'completedDate') {
      filteredBooks.sort((a, b) => {
        const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
        const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
        return dateB - dateA;
      });
    } else if (params?.sortBy === 'createdAt') {
      filteredBooks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return of({
      books: paginatedBooks,
      totalBooks: filteredBooks.length,
      totalPages: Math.ceil(filteredBooks.length / limit),
      currentPage: page
    }).pipe(delay(300)); // Simulate network delay
  }

  getRecentlyCompleted(limit: number = 10): Observable<BookListResponse> {
    return this.getBooks({
      status: 'completed',
      sortBy: 'completedDate',
      limit,
      page: 1
    });
  }

  getCurrentlyReading(): Observable<BookListResponse> {
    return this.getBooks({
      status: 'reading',
      limit: 100,
      page: 1
    });
  }

  getBookById(id: number): Observable<Book> {
    const book = this.books.find(b => b.id === id);
    return of(book!).pipe(delay(200));
  }

  createBook(book: Book): Observable<Book> {
    const newBook: Book = {
      ...book,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.books.unshift(newBook);
    return of(newBook).pipe(delay(300));
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index] = {
        ...this.books[index],
        ...book,
        updatedAt: new Date().toISOString()
      };
      return of(this.books[index]).pipe(delay(300));
    }
    return of({} as Book);
  }

  deleteBook(id: number): Observable<{ message: string }> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
    return of({ message: 'Book deleted successfully' }).pipe(delay(200));
  }
}
