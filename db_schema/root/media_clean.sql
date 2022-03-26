-- Drop table if exists media_clean
USE journalbrew_db;
DROP TABLE IF EXISTS media_clean;
CREATE TABLE media_clean (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    full_story_id INT UNSIGNED default 0,
    media_url TEXT NOT NULL,
    removal_status boolean default 0,
    PRIMARY KEY(id),
    FOREIGN KEY (full_story_id) REFERENCES user_to_post(id) ON DELETE SET NULL
);