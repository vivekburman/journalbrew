-- Drop table if exists post
USE topselfnews_db;
DROP TABLE IF EXISTS post;
CREATE TABLE post (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    title TEXT NOT NULL,
    thumbnail TEXT,
    summary TEXT NOT NULL,
    tags JSON NOT NULL,
    location VARCHAR(255) NOT NULL,
    likes INT UNSIGNED DEFAULT 0,
    views INT UNSIGNED DEFAULT 0,
    type ENUM('article', 'opinion', 'eod') NOT NULL,
    full_story_id INT UNSIGNED NOT NULL,
    publish_status ENUM('published', 'underReview', 'discarded', 'removed'),
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (full_story_id) REFERENCES user_to_post(id)
);