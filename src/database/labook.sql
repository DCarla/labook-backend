-- Active: 1690566119873@@127.0.0.1@3306

CREATE TABLE users(
 id TEXT UNIQUE PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 role TEXT NOT NULL ,
 created_at TEXT DEFAULT(datetime('now','localtime'))
);

DROP TABLE users;

SELECT * FROM users;

INSERT INTO users(id, name, email, password, role)
VALUES ('U001', 'Diane', 'diane@gmail.com', '123456','admin'),
       ('U002', 'Carla', 'carla@gmail.com','123456','user'),
       ('U003', 'Sofia', 'sofia@gmail.com','123456','user');


CREATE TABLE posts(
    id TEXT UNIQUE PRIMARY KEY,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(datetime('now','localtime')),
    updated_at TEXT ,
    FOREIGN KEY (creator_id) REFERENCES users(id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
    );
    drop table posts;

    CREATE TABLE like_deslike(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
  
    );

   INSERT  INTO posts(id, content, likes, dislikes, creator_id)
        VALUES ('P001', 'Conteudo sobre dogs',0,0, 'U001');

    select * from like_deslike;
         
  
   

   