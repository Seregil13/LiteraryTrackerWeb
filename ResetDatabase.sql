DROP TABLE IF EXISTS books, lightnovels, manga, genres;

CREATE TABLE genres
(
  name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (name)
);

CREATE TABLE books
(
  book_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(500),
  link VARCHAR(255),
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (book_id),
  FOREIGN KEY (genre_id) REFERENCES genres(name)
);

CREATE TABLE manga
(
  manga_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(500),
  completed BOOLEAN,
  genre_id INTEGER NOT NULL,
  translator_site VARCHAR(255) NOT NULL,
  PRIMARY KEY (manga_id),
  FOREIGN KEY (genre_id) REFERENCES genres(name)
);

CREATE TABLE lightnovels
(
  lightnovel_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50),
  description VARCHAR(500),
  completed BOOLEAN,
  translator_site VARCHAR(255) NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (lightnovel_id),
  FOREIGN KEY (genre_id) REFERENCES genres(name) # change to many to many relationship
);

CREATE TABLE lightnovels_genre
(
  lightnovel_id INTEGER NOT NULL,
  genre_name VARCHAR(50) NOT NULL,
  PRIMARY KEY(lightnovel_id,genre_name),
  FOREIGN KEY (lightnovel_id) REFERENCES lightnovels(lightnovel_id),
  FOREIGN KEY (genre_name) REFERENCES genres(name)
);

CREATE TABLE manga_genre
(
  manga_id INTEGER NOT NULL,
  genre_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (manga_id, genre_name),
  FOREIGN KEY (manga_id) REFERENCES manga(manga_id),
  FOREIGN KEY (genre_name) REFERENCES genres(name)
);

CREATE TABLE book_genre
(
  book_id INTEGER NOT NULL,
  genre_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (book_id, genre_name),
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (genre_name) REFERENCES genres(name)
);
