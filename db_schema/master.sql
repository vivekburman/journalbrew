-- DROP the database 'topselfnews_db' if exists and create
-- a new one

DROP DATABASE IF EXISTS topselfnews_db;

CREATE DATABASE topselfnews_db;

USE topselfnews_db;


-- and drop the table user if exists
-- create a new one

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT NOT NULL,
    strategy_id TEXT NOT NULL,
    strategy_type VARCHAR(8) NOT NULL,
    email TEXT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    middle_name VARCHAR(20),
    last_name VARCHAR(20),
    profile_pic_url TEXT,
    created_at DATETIME NOT NULL,
    last_logged_at DATETIME,
    PRIMARY KEY(id)
);

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
    publish_status ENUM('published', 'pendingReview', 'underReview', 'draft', 'discarded', 'removed')
    reported_by TEXT,
    created_at DATETIME NOT NULL,
);