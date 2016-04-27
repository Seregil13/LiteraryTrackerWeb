/**
 * A central place for the database schema so if the schema changes only this file
 * has to change and the rest of the application will follow suit.
 *
 * Created by Alec on 3/18/2016.
 */

module.exports = {
    lightnovels: {
        table_name: 'lightnovels',
        columns: {
            id: 'lightnovel_id',
            title: 'title',
            author: 'author',
            description: 'description',
            completed: 'completed',
            translator: 'translator_site'
        }
    },
    books: {
        table_name: 'books',
        columns: {
            id: 'book_id',
            title: 'title',
            author: 'author',
            description: 'description',
            link: 'link'
        }
    },
    manga: {
        table_name: 'manga',
        columns: {
            id: 'manga_id',
            title: 'title',
            author: 'author',
            description: 'description',
            completed: 'completed',
            translator_site: 'translator_site'
        }
    },
    lightnovelgenres: {
        table_name: 'lightnovels_genres',
        columns: {
            ln: 'lightnovel_id',
            genre: 'genre_id'
        }
    },
    mangagenres: {
        table_name: 'manga_genres',
        columns: {
            manga: 'manga_id',
            genre: 'genre_id'
        }
    },
    bookgenres: {
        table_name: 'books_genres',
        columns: {
            book: 'book_id',
            genre: 'genre_id'
        }
    },
    genres: {
        table_name: 'genres',
        columns: {
            id: 'genre_id',
            name: 'genre_name'
        }
    }
};