import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm/relations";

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),

  status: text("status", { enum: ["planned", "reading", "completed"] })
    .notNull()
    .default("planned"),

  rating: integer("rating").default(0),
  notes: text("notes"),
  imageUrl: text("image_url"),
  pages: integer("pages"),
  currentPage: integer("current_page"),
  description: text("description"),
  publishedDate: text("published_date"),
  genres: text("genres"),
  isbn: text("isbn"),
  startedDate: text("started_date"),
  completedDate: text("completed_date"),

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  statusIdx: index("idx_books_status").on(table.status),
  isbnIdx: index("idx_books_isbn").on(table.isbn),
}));