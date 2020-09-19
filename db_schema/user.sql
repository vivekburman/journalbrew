-- use database topselfnews_db
-- and drop the table user if exists
-- create a new one

USE topselfnews_db;
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
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
    PRIMARY KEY(id)
);