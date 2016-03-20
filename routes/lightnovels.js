/**
 * Handles requests to the /lightnovel directory of the server.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/create', function(req, res, next) {

    // NOTE: Creates an object to be inserted and escaped by the 'query' function
    var lightnovel = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        completed: req.body.completed ? true : false,
        translator_site: req.body.tsite
    };

    var genres = req.body.genres.split(','); // FIXME: find better way to upload genres list

    /**
     * This is valid MySQL syntax but not valid SQL syntax
     *
     * https://dev.mysql.com/doc/refman/5.6/en/insert.html
     */
    var insert = "INSERT INTO " + req.schema.LightNovels.table_name + " SET ?";

    req.db.query(insert, [ lightnovel ], function(err, rows) {
        if (err) throw err; // TODO: handle error nicer

        var lnId = rows.insertId;
        if (genres.length < 1) return;

        /* Inserts any genres that don't already exist into the system */
        var insertGenres = "INSERT IGNORE INTO " + req.schema.Genres.table_name + "(" + req.schema.Genres.columns.name + ") VALUES ";
        for (var i = 0; i < genres.length - 1; ++i) {
            insertGenres += "(" + req.db.escape(genres[i].trim()) + "),";
        }
        insertGenres += "(" + req.db.escape(genres[genres.length - 1].trim()) + ")";

        console.log("Insert Genres: " + insertGenres);

        req.db.query(insertGenres, function (err, rows) {
            if (err) throw err;

            /* Inserts the many-many relationship of genres and light novels */
            var insertLnGenres = "INSERT INTO " + req.schema.LightNovelGenres.table_name + " VALUES";
            for (var i = 0; i < genres.length - 1; ++i) {
                insertLnGenres += "(" + req.db.escape(lnId) +
                    ", (SELECT " + req.schema.Genres.columns.id +
                    " FROM " + req.schema.Genres.table_name +
                    " WHERE " + req.schema.Genres.columns.name + "=" + req.db.escape(genres[i].trim()) + ")),";
            }

            insertLnGenres += "(" + req.db.escape(lnId) +
                ", (SELECT " + req.schema.Genres.columns.id +
                " FROM " + req.schema.Genres.table_name +
                " WHERE " + req.schema.Genres.columns.name + "=" + req.db.escape(genres[i].trim()) + "))";

            console.log("Insert LN Genres: " + insertLnGenres);

            req.db.query(insertLnGenres, function (err, rows) {
                if (err) throw err;

                console.log("Inserted " + rows.rowsAffected + " genres for " + lightnovel.title);
                res.end();
            })
        });
    });
});

// TODO: actually create a form to be used on a website
router.get('/update/:lnId', function (req, res, next) {

    var query = "SELECT * FROM " + req.schema.LightNovels.table_name + " ln " +
        "LEFT JOIN " + req.schema.LightNovelGenres.table_name + " lng " +
        "ON ln." + req.schema.LightNovels.columns.id + " = lng." + req.schema.LightNovelGenres.columns.ln + " " +
        "LEFT JOIN " + req.schema.Genres.table_name + " g" +
        " ON lng." + req.schema.LightNovelGenres.columns.genre + " = g." + req.schema.Genres.columns.id + " " +
        "WHERE ln." + req.schema.LightNovels.columns.id + "=?";

    req.db.query(query, [ req.params.lnId ], function (err, rows) {
        if (err) throw err;

        var result = {
            "id": req.params.lnId,
            "title": rows[0].title,
            "author": rows[0].author,
            "description": rows[0].description,
            "completed": rows[0].completed ? true : false,
            "translatorSite": rows[0].translator_site,
            "genres": []
        };

        /* Finds all the genres associated with the light novel and puts them into an array */
        if (rows[0].genre_name) {
            for (var i = 0; i < rows.length; ++i) {
                result.genres.push(rows[i].genre_name);
            }
        }

        res.render('update', {
            id: req.params.lnId,
            title: result.title,
            author: result.author,
            description: result.description,
            completed: result.completed,
            translatorSite: result.translatorSite,
            genres: result.genres.join(',')
        })
    })

});

router.post('/update/:lnId', function (req, res, next) {

    // TODO: update

    var id = req.params.lnId;

    if (!isNaN(id)) {

        var genres = req.body.genres.split(','); // fixme: find a better way to get the genres

        var values = {
            title: req.body.title,
            author: req.body.author,
            completed: req.body.completed ? true : false,
            description: req.body.description,
            translator_site: req.body.tsite
        };
        
        var update = "UPDATE ?? SET ? WHERE lightnovel_id = ?";

        /* Update  */
        req.db.query(update, [ req.schema.LightNovels.table_name, values, id ], function(err, rows) {
           if (err) throw err; // TODO: handle error nicer

            console.log(rows.changedRows);

            if (genres.length < 1) return;

            /* Inserts any genres that don't already exist into the system */
            var insertGenres = "INSERT IGNORE INTO " + req.schema.Genres.table_name + "(" + req.schema.Genres.columns.name + ") VALUES ";
            for (var i = 0; i < genres.length - 1; ++i) {
                insertGenres += "(" + req.db.escape(genres[i].trim()) + "),";
            }
            insertGenres += "(" + req.db.escape(genres[genres.length - 1].trim()) + ")";

            console.log("Insert Genres: " + insertGenres);

            /* Insert any new genres while ignoring any problems from inserting values that already exist */
            req.db.query(insertGenres, function (err, rows) {
                if (err) throw err;

                /* Inserts the many-many relationship of genres and light novels */
                var insertLnGenres = "INSERT IGNORE INTO " + req.schema.LightNovelGenres.table_name + " VALUES";
                for (var i = 0; i < genres.length - 1; ++i) {
                    insertLnGenres += "(" + req.db.escape(id) +
                        ", (SELECT " + req.schema.Genres.columns.id +
                        " FROM " + req.schema.Genres.table_name +
                        " WHERE " + req.schema.Genres.columns.name + "=" + req.db.escape(genres[i].trim()) + ")),";
                }

                insertLnGenres += "(" + req.db.escape(id) +
                    ", (SELECT " + req.schema.Genres.columns.id +
                    " FROM " + req.schema.Genres.table_name +
                    " WHERE " + req.schema.Genres.columns.name + "=" + req.db.escape(genres[i].trim()) + "))";

                console.log("Insert LN Genres: " + insertLnGenres);

                req.db.query(insertLnGenres, function (err, rows) {
                    if (err) throw err;

                    var deleteLnGenres = "DELETE FROM " + req.schema.LightNovelGenres.table_name +
                            " WHERE " + req.schema.LightNovelGenres.columns.ln + "=" + id +
                            " AND " + req.schema.LightNovelGenres.columns.genre +
                            " NOT IN (SELECT " + req.schema.Genres.columns.id +
                            " FROM " + req.schema.Genres.table_name +
                            " WHERE " + req.schema.Genres.columns.name + " IN (" +
                            genres.map(function (v) {
                                return req.db.escape(v);
                            }).reduce(function (p,c,i,a) {
                                return p + ',' + c;
                            }) + "))";

                    console.log(deleteLnGenres);

                    req.db.query(deleteLnGenres, function (err, rows) {
                        if (err) throw err; // TODO

                        res.redirect('/');
                    });
                })
            });
        });
    }
});

router.get('/list', function(req, res, next) {

    var select = "SELECT ?? FROM ??;";
    var columns = [req.schema.LightNovels.columns.id, req.schema.LightNovels.columns.title, req.schema.LightNovels.columns.author ];

    req.db.query(select, [ columns, req.schema.LightNovels.table_name ], function(err, rows) {
        if (err) throw err; // TODO: Handle mysql errors more gracefully

        var output = [];
        for (var i = 0; i < rows.length; ++i) {

            var novel = {
                "id": rows[i].lightnovel_id,
                "title": rows[i].title,
                "author": rows[i].author
            };
            output.push(novel)
        }
        res.json(output);
    });
});

router.get('/get/:lnId', function (req, res, next) {

    /* See public/js/schema.js for the values in the schema */
    var query = "SELECT * FROM " + req.schema.LightNovels.table_name + " ln " +
        "LEFT JOIN " + req.schema.LightNovelGenres.table_name + " lng " +
        "ON ln." + req.schema.LightNovels.columns.id + " = lng." + req.schema.LightNovelGenres.columns.ln + " " +
        "LEFT JOIN " + req.schema.Genres.table_name + " g" +
        " ON lng." + req.schema.LightNovelGenres.columns.genre + " = g." + req.schema.Genres.columns.id + " " +
        "WHERE ln." + req.schema.LightNovels.columns.id + "=?";

    req.db.query(query, [ req.params.lnId ], function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        // Formats the query results into a single javascript object because query  returns with the number of rows equal to the number of genres a light novel is a part of.
        var result = {
            "id": req.params.lnId,
            "title": rows[0].title,
            "author": rows[0].author,
            "description": rows[0].description,
            "completed": rows[0].completed ? true : false,
            "translatorSite": rows[0].translator_site,
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

// TODO: Figure out if this is even needed ??
router.get("/exists/:lnTitle", function(req, res, next) {
    var query = "SELECT EXISTS(SELECT 1 FROM " + req.schema.LightNovels.table_name + " WHERE " + req.schema.LightNovels.columns.title + "=?) AS exist";

    req.db.query(query, [ req.params.lnTitle ], function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        var result= {
            "exists": rows[0].exist == 1
        };

        res.json(result);
    });
});

module.exports = router;