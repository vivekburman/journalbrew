-- Drop table if exists post
USE topselfnews_db;
DROP TABLE IF EXISTS post;
CREATE TABLE post (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    title TEXT NOT NULL,
    thumbnail TEXT,
    summary TEXT NOT NULL,
    tags TINYTEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    author_id INT UNSIGNED NOT NULL,
    likes INT UNSIGNED DEFAULT 0,
    views INT UNSIGNED DEFAULT 0,
    type ENUM('article', 'opinion', 'eod') NOT NULL,
    full_story JSON NOT NULL,
    publish_status ENUM('published', 'pendingReview', 'underReview', 'draft', 'discarded', 'removed'),
    reported_by TEXT,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (author_id) REFERENCES user(id)
);