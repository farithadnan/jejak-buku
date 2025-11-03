import { Request, Response } from 'express';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { books } from '../db/schema';
import { eq, and, gte, sql, count } from 'drizzle-orm';

const sqlite = new Database(process.env.DATABASE_URL!);
const db = drizzle(sqlite);

// Helper to parse genres
function parseGenresOut(genres: any): string[] {
  try { return genres ? JSON.parse(genres) : []; } catch { return []; }
}

// GET /api/statistics
export const getStatistics = async (req: Request, res: Response) => {
  try {
    // 1. Total books and by status
    const allBooks = await db.select().from(books).all();

    const totalBooks = allBooks.length;
    const booksByStatus = {
      planned: allBooks.filter(b => b.status === 'planned').length,
      reading: allBooks.filter(b => b.status === 'reading').length,
      completed: allBooks.filter(b => b.status === 'completed').length,
    };

    // 2. Total pages read (only from completed books)
    const totalPagesRead = allBooks
      .filter(b => b.status === 'completed' && b.pages)
      .reduce((sum, book) => sum + (book.pages || 0), 0);

    // 3. Average rating (only rated completed books)
    const ratedBooks = allBooks.filter(b => b.status === 'completed' && b.rating && b.rating > 0);
    const averageRating = ratedBooks.length > 0
      ? ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length
      : 0;

    // 4. Top 5 genres
    const genreCounts: Record<string, number> = {};
    allBooks.forEach(book => {
      const genres = parseGenresOut(book.genres);
      genres.forEach(genre => {
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
    });

    const topGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Monthly trend (last 6 months)
    const now = new Date();
    const monthlyTrend = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const completedInMonth = allBooks.filter(book => {
        if (book.status !== 'completed' || !book.completedDate) return false;
        return book.completedDate >= monthStart && book.completedDate <= monthEnd;
      }).length;

      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      monthlyTrend.push({
        month: monthName,
        completed: completedInMonth
      });
    }

    // 6. This month completed
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const thisMonthCompleted = allBooks.filter(book => {
      if (book.status !== 'completed' || !book.completedDate) return false;
      return book.completedDate >= thisMonthStart;
    }).length;

    // 7. This year completed
    const thisYearStart = new Date(now.getFullYear(), 0, 1).toISOString();
    const thisYearCompleted = allBooks.filter(book => {
      if (book.status !== 'completed' || !book.completedDate) return false;
      return book.completedDate >= thisYearStart;
    }).length;

    // Send response
    res.json({
      totalBooks,
      booksByStatus,
      totalPagesRead,
      averageRating: Math.round(averageRating * 10) / 10,
      topGenres,
      monthlyTrend,
      thisMonthCompleted,
      thisYearCompleted,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
