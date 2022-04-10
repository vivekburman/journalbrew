-- Drop table if exists post
USE journalbrew_db;
DROP TABLE IF EXISTS post;
CREATE TABLE post (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id BINARY(16) NOT NULL,
    title VARCHAR(150) NOT NULL,
    -- thumbnail TEXT,
    summary VARCHAR(150) NOT NULL,
    tags JSON NOT NULL,
    location VARCHAR(50) NOT NULL,
    likes INT UNSIGNED DEFAULT 0,
    views INT UNSIGNED DEFAULT 0,
    type ENUM('article', 'opinion', 'eod') NOT NULL,
    full_story_id INT UNSIGNED NOT NULL,
    publish_status ENUM('published', 'underReview', 'discarded', 'removed'),
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT full_story_unqiue UNIQUE(full_story_id),
    FOREIGN KEY (full_story_id) REFERENCES user_to_post(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES user(uuid)
);