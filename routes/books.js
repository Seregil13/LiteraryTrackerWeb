/**
 * Handles requests to the /books directory of the server.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.post('/create', function(req, res, next) {

    // NOTE: Creates an object to be inserted and escaped by the 'query' function
    var book = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        completed: req.body.completed ? true : false,
        link: req.body.link
    };

    var genres = req.body.genres.split(','); // NOTE: genres are passed as a csv string  ( "fantasy,martial arts,mature" )

    /**
     * This is valid MySQL syntax but not valid SQL syntax
     *
     * https://dev.mysql.com/doc/refman/5.6/en/insert.html
     */
    var insert = "INSERT INTO " + req.schema.books.table_name + " SET ?";

    req.db.query(insert, [ book ], function(err, rows) {
        if (err) throw err; // TODO: handle error nicer

        var bookId = rows.insertId;
        if (genres.length < 1) return;

        /* Inserts any genres that don't already exist into the system */
        var insertGenres = "INSERT IGNORE INTO " + req.schema.genres.table_name + "(" + req.schema.genres.columns.name + ") VALUES ";
        
        for (var i = 0; i < genres.length - 1; ++i) {
            insertGenres += "(" + req.db.escape(genres[i].trim()) + "),";
        }
        insertGenres += "(" + req.db.escape(genres[genres.length - 1].trim()) + ")";

        req.db.query(insertGenres, insertGenresParams, function (err, rows) {
            if (err) throw err;

            /* Inserts the many-many relationship of genres and light novels */            
            var insertBookGenres = "INSERT INTO " + req.schema.bookgenres.table_name + " VALUES";
            for (var i = 0; i < genres.length - 1; ++i) {
                insertBookGenres += "(" + req.db.escape(bookId) +
                    ", (SELECT " + req.schema.genres.columns.id +
                    " FROM " + req.schema.genres.table_name +
                    " WHERE " + req.schema.genres.columns.name + "=" + req.db.escape(genres[i].trim()) + ")),";
            }

            insertBookGenres += "(" + req.db.escape(bookId) +
                ", (SELECT " + req.schema.genres.columns.id +
                " FROM " + req.schema.genres.table_name +
                " WHERE " + req.schema.genres.columns.name + "=" + req.db.escape(genres[i].trim()) + "))";

            req.db.query(insertBookGenres, function (err, rows) {
                if (err) throw err;

                res.json({ success: true });
            })
        });
    });
});

router.post('/update/:id', function (req, res, next) {

    var id = req.params.id;

    if (!isNaN(id)) {

        var genres = req.body.genres.split(','); // fixme: find a better way to get the genres

        var values = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            link: req.body.link
        };

        /* The update sql command */
        var update = "UPDATE ?? SET ? WHERE ? = ?";
        var updateParams = [ req.schema.books.table_name, values, req.schema.books.columns.id, id ];

        /* Update  */
        req.db.query(update, updateParams, function(err, rows) {
            if (err) throw err; // TODO: handle error nicer

            if (genres.length < 1) return;

            /* Inserts any genres that don't already exist into the system */
            var insertGenres = "INSERT IGNORE INTO " + req.schema.genres.table_name + "(" + req.schema.genres.columns.name + ") VALUES ";
            for (var i = 0; i < genres.length - 1; ++i) {
                insertGenres += "(" + req.db.escape(genres[i].trim()) + "),";
            }
            insertGenres += "(" + req.db.escape(genres[genres.length - 1].trim()) + ")";

            console.log("Insert genres: " + insertGenres);

            /* Insert any new genres while ignoring any problems from inserting values that already exist */
            req.db.query(insertGenres, function (err, rows) {
                if (err) throw err;

                /* Inserts the many-many relationship of genres and light novels */
                var insertBookGenres = "INSERT IGNORE INTO " + req.schema.bookgenres.table_name + " VALUES";
                for (var i = 0; i < genres.length - 1; ++i) {
                    insertBookGenres += "(" + req.db.escape(id) +
                        ", (SELECT " + req.schema.genres.columns.id +
                        " FROM " + req.schema.genres.table_name +
                        " WHERE " + req.schema.genres.columns.name + "=" + req.db.escape(genres[i].trim()) + ")),";
                }

                insertBookGenres += "(" + req.db.escape(id) +
                    ", (SELECT " + req.schema.genres.columns.id +
                    " FROM " + req.schema.genres.table_name +
                    " WHERE " + req.schema.genres.columns.name + "=" + req.db.escape(genres[i].trim()) + "))";

                console.log("Insert Book genres: " + insertBookGenres);

                req.db.query(insertBookGenres, function (err, rows) {
                    if (err) throw err;

                    var deleteBookGenres = "DELETE FROM " + req.schema.bookgenres.table_name +
                        " WHERE " + req.schema.bookgenres.columns.book + "=" + id +
                        " AND " + req.schema.bookgenres.columns.genre +
                        " NOT IN (SELECT " + req.schema.genres.columns.id +
                        " FROM " + req.schema.genres.table_name +
                        " WHERE " + req.schema.genres.columns.name + " IN (" +
                        genres.map(function (v) {
                            return req.db.escape(v);
                        }).reduce(function (p,c,i,a) {
                            return p + ',' + c;
                        }) + "))";

                    console.log(deleteBookGenres);

                    req.db.query(deleteBookGenres, function (err, rows) {
                        if (err) throw err; // TODO better error handling

                        res.json({success: true });
                    });
                })
            });
        });
    }
});

router.get('/list', function(req, res, next) {

    var select = "SELECT ?? FROM ??;";
    var columns = [
        req.schema.books.columns.id,
        req.schema.books.columns.title,
        req.schema.books.columns.author
    ];

    var params = [ columns, req.schema.books.table_name ];

    req.db.query(select, params, function(err, rows) {
        if (err) throw err; // TODO: Handle mysql errors more gracefully

        var output = [];
        for (var i = 0; i < rows.length; ++i) {

            var novel = {
                "id": rows[i].book_id,
                "title": rows[i].title,
                "author": rows[i].author
            };
            output.push(novel)
        }
        res.json(output);
    });
});

router.get('/get/:id', function (req, res, next) {

    /* See public/js/schema.js for the values in the schema */
    var query = "SELECT * FROM ?? b LEFT JOIN ?? bg ON b.?? = bg.?? LEFT JOIN ?? g ON bg.?? = g.?? WHERE b.?? = ?";

    var queryParams = [
        req.schema.books.table_name,
        req.schema.bookgenres.table_name,
        req.schema.books.columns.id,
        req.schema.bookgenres.columns.book,
        req.schema.genres.table_name,
        req.schema.bookgenres.columns.genre,
        req.schema.genres.columns.id,
        req.schema.books.columns.id,
        req.params.id
    ];

    req.db.query(query, queryParams, function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        // Formats the query results into a single javascript object because query  returns with the number of rows equal to the number of genres a light novel is a part of.
        var result = {
            "id": req.params.id,
            "title": rows[0].title,
            "author": rows[0].author,
            "description": rows[0].description,
            "link": rows[0].link,
            "genres": []
        };

        /* Finds all the genres associated with the light novel and puts them into an array */
        if (rows[0].genre_name) {
            for (var i = 0; i < rows.length; ++i) {
                result.genres.push(rows[i].genre_name);
            }
        }

        res.json(result);
    });
});

// TODO: Figure out if this is even needed ?!?
router.get("/exists/:title", function(req, res, next) {
    var query = "SELECT EXISTS(SELECT 1 FROM ?? WHERE ? = ?) AS exist";// + req.schema.book.table_name + " WHERE " + req.schema.book.columns.title + "=?) AS exist";
    var params = [ req.schema.book.table_name, req.schema.book.columns.title, req.params.title ];

    req.db.query(query, params, function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        var result= {
            "exists": rows[0].exist == 1
        };

        res.json(result);
    });
});

module.exports = router;