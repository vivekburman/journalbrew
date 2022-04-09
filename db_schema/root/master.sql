-- DROP the database 'journalbrew_db' if exists and create
-- a new one

DROP DATABASE IF EXISTS journalbrew_db;

CREATE DATABASE journalbrew_db;

USE journalbrew_db;


-- and drop the table user if exists
-- create a new one

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    uuid BINARY(16) NOT NULL,
    strategy_id TEXT NOT NULL,
    strategy_type VARCHAR(8) NOT NULL,
    email TEXT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    middle_name VARCHAR(20),
    last_name VARCHAR(20),
    profile_pic_url TEXT,
    created_at DATETIME NOT NULL,
    last_logged_at DATETIME,
    PRIMARY KEY(uuid)
);

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
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS user_to_post;
CREATE TABLE user_to_post (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id BINARY(16) NOT NULL,
    full_story JSON NOT NULL,
    post_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (author_id) REFERENCES user(uuid),
);
ALTER TABLE user_to_post add FOREIGN KEY (post_id) REFERENCES post(id);

ALTER TABLE post add FOREIGN KEY (full_story_id) REFERENCES user_to_post(id);
ALTER TABLE post add FOREIGN KEY (author_id) REFERENCES user_to_post(author_id);

DROP TABLE IF EXISTS bookmark;
CREATE TABLE bookmark (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_uuid BINARY(16) NOT NULL,
    bookmark_post_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (user_uuid) REFERENCES user(uuid),
    CONSTRAINT bookmark_pair_unique UNIQUE(user_uuid, bookmark_post_id)
);

DROP TABLE IF EXISTS follow;
CREATE TABLE follow (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    follower_uuid BINARY(16) NOT NULL,
    following_uuid BINARY(16) NOT NULL,
    FOREIGN KEY (follower_uuid) REFERENCES user(uuid),
    FOREIGN KEY (following_uuid) REFERENCES user(uuid),
    CONSTRAINT follow_pair_unique UNIQUE(follower_uuid, following_uuid),
    PRIMARY KEY(id)
);
