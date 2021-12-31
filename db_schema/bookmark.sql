-- Drop table if exists post
USE topselfnews_db;
DROP TABLE IF EXISTS bookmark;
CREATE TABLE bookmark (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_uuid BINARY(16) NOT NULL,
    bookmark_post_id INT UNSIGNED NOT NULL, 
    PRIMARY KEY(id),
    FOREIGN KEY (user_uuid) REFERENCES user(uuid),
    FOREIGN KEY (bookmark_post_id) REFERENCES post(id)
    CONSTRAINT bookmark_pair_unique UNIQUE(user_uuid, bookmark_post_id)
);