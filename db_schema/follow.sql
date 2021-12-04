-- use database topselfnews_db
-- and drop the table follow if exists
-- create a new one

USE topselfnews_db;
DROP TABLE IF EXISTS follow;
CREATE TABLE follow (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    follower_uuid BINARY(16) NOT NULL,
    following_uuid BINARY(16) NOT NULL,
    FOREIGN KEY (follower_uuid) REFERENCES user(author_id),
    FOREIGN KEY (following_uuid) REFERENCES user(author_id),
    CONSTRAINT follow_pair_unique UNIQUE(follower_uuid, following_uuid)
    PRIMARY KEY(id)
);