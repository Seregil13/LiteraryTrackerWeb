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