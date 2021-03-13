-- Drop table if exists user_to_post
USE topselfnews_db;
DROP TABLE IF EXISTS user_to_post;
CREATE TABLE user_to_post (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id BINARY(16) NOT NULL,
    full_story JSON NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (author_id) REFERENCES user(uuid)
);