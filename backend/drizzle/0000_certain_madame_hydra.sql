CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`rating` integer DEFAULT 0,
	`notes` text,
	`image_url` text,
	`pages` integer,
	`current_page` integer,
	`description` text,
	`published_date` text,
	`genres` text,
	`isbn` text,
	`started_date` text,
	`completed_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_books_status` ON `books` (`status`);--> statement-breakpoint
CREATE INDEX `idx_books_isbn` ON `books` (`isbn`);