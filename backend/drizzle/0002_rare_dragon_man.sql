PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`rating` integer,
	`notes` text,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_books`("id", "title", "author", "status", "rating", "notes", "user_id") SELECT "id", "title", "author", "status", "rating", "notes", "user_id" FROM `books`;--> statement-breakpoint
DROP TABLE `books`;--> statement-breakpoint
ALTER TABLE `__new_books` RENAME TO `books`;--> statement-breakpoint
PRAGMA foreign_keys=ON;