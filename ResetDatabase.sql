DROP TABLE IF EXISTS  lightnovels_genres, books_genres, manga_genres, books, lightnovels, manga, genres;

CREATE TABLE genres
(
  genre_id   INTEGER     NOT NULL AUTO_INCREMENT,
  genre_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (genre_id)
);

CREATE TABLE books
(
  book_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(5000),
  link VARCHAR(255),
  PRIMARY KEY (book_id)
);

CREATE TABLE manga
(
  manga_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(5000),
  completed BOOLEAN,
  translator_site VARCHAR(255) NOT NULL,
  PRIMARY KEY (manga_id)
);

CREATE TABLE lightnovels
(
  lightnovel_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(5000),
  completed BOOLEAN,
  translator_site VARCHAR(255) NOT NULL,
  PRIMARY KEY (lightnovel_id)
);

CREATE TABLE lightnovels_genres
(
  lightnovel_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY(lightnovel_id,genre_id),
  FOREIGN KEY (lightnovel_id) REFERENCES lightnovels(lightnovel_id),
  FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE manga_genres
(
  manga_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (manga_id, genre_id),
  FOREIGN KEY (manga_id) REFERENCES manga(manga_id),
  FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE books_genres
(
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (book_id, genre_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

# Insert starting genres
INSERT INTO genres (genre_name) VALUES ('action');
INSERT INTO genres (genre_name) VALUES ('adventure');
INSERT INTO genres (genre_name) VALUES ('comedy');
INSERT INTO genres (genre_name) VALUES ('doujinshi');
INSERT INTO genres (genre_name) VALUES ('drama');
INSERT INTO genres (genre_name) VALUES ('ecchi');
INSERT INTO genres (genre_name) VALUES ('fantasy');
INSERT INTO genres (genre_name) VALUES ('gender bender');
INSERT INTO genres (genre_name) VALUES ('harem');
INSERT INTO genres (genre_name) VALUES ('historical');
INSERT INTO genres (genre_name) VALUES ('horror');
INSERT INTO genres (genre_name) VALUES ('josei');
INSERT INTO genres (genre_name) VALUES ('martial arts');
INSERT INTO genres (genre_name) VALUES ('mature');
INSERT INTO genres (genre_name) VALUES ('mecha');
INSERT INTO genres (genre_name) VALUES ('mystery');
INSERT INTO genres (genre_name) VALUES ('one shot');
INSERT INTO genres (genre_name) VALUES ('psycological');
INSERT INTO genres (genre_name) VALUES ('romance');
INSERT INTO genres (genre_name) VALUES ('school life');
INSERT INTO genres (genre_name) VALUES ('sci-fi');
INSERT INTO genres (genre_name) VALUES ('seinen');
INSERT INTO genres (genre_name) VALUES ('shoujo');
INSERT INTO genres (genre_name) VALUES ('shoujo ai');
INSERT INTO genres (genre_name) VALUES ('shounen');
INSERT INTO genres (genre_name) VALUES ('shounen ai');
INSERT INTO genres (genre_name) VALUES ('slice of life');
INSERT INTO genres (genre_name) VALUES ('sports');
INSERT INTO genres (genre_name) VALUES ('supernatural');
INSERT INTO genres (genre_name) VALUES ('tragedy');
INSERT INTO genres (genre_name) VALUES ('yaoi');
INSERT INTO genres (genre_name) VALUES ('yuri');
