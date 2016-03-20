/**
 * Created by Alec on 3/18/2016.
 */

module.exports = {
    LightNovels: {
        table_name: 'lightnovels',
        columns: {
            id: 'lightnovel_id',
            title: 'title',
            author: 'author',
            description: 'description',
            completed: 'completed',
            translator: 'translatorSite'
        }
    },
    LightNovelGenres: {
        table_name: 'lightnovels_genres',
        columns: {
            ln: 'lightnovel_id',
            genre: 'genre_id'
        }
    },
    Genres: {
        table_name: 'genres',
        columns: {
            id: 'genre_id',
            name: 'genre_name'
        }
    }
};