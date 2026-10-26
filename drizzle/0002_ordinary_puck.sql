CREATE TABLE `apartments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`link` varchar(2048),
	`city` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`nearest_landmark` varchar(128) NOT NULL,
	`distance_meters` int NOT NULL,
	`rating` varchar(16) NOT NULL,
	`review_count` int NOT NULL DEFAULT 0,
	`review_summary` varchar(255) NOT NULL,
	`price_from` varchar(64),
	`image_url` varchar(512),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apartments_id` PRIMARY KEY(`id`)
);
