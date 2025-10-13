PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`rating` integer DEFAULT 0,
	`notes` text,
	`user_id` integer NOT NULL,
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
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` integer,
	`updated_by` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_books`("id", "title", "author", "status", "rating", "notes", "user_id", "image_url", "pages", "current_page", "description", "published_date", "genres", "isbn", "started_date", "completed_date", "created_at", "updated_at", "created_by", "updated_by") SELECT "id", "title", "author", "status", "rating", "notes", "user_id", "image_url", "pages", "current_page", "description", "published_date", "genres", "isbn", "started_date", "completed_date", "created_at", "updated_at", "created_by", "updated_by" FROM `books`;--> statement-breakpoint
DROP TABLE `books`;--> statement-breakpoint
ALTER TABLE `__new_books` RENAME TO `books`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_books_user_id` ON `books` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_books_status` ON `books` (`status`);--> statement-breakpoint
CREATE INDEX `idx_books_isbn` ON `books` (`isbn`);--> statement-breakpoint
ALTER TABLE `users` ADD `started_date` text;--> statement-breakpoint
ALTER TABLE `users` ADD `completed_date` text;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `created_by` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_by` integer;