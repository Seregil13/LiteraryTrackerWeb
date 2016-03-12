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
    // NOTE: This will only be effective with mysql as 'SET' is a convenience added by mysql
    var insertLightNovel = "INSERT INTO lightnovels SET ?";

    var genres = req.body.genres;

    console.log("Inserting: " + mysql.format(insertLightNovel, lightnovel));

    var query = req.db.query(insertLightNovel, lightnovel, function(err, rows) {
        if (err) throw err;

        //var lnId = rows.insertId;
        //
        //var insert = "INSERT INTO lightnovels_genres VALUES ";
        //
        //for (var i = 0; i < genres.length; ++i) {
        //    insert += ()
        //}
        //
        //req.db.query()

        console.log(rows);
        console.log("Inserted: " + mysql.format(insertLightNovel, lightnovel));
        res.end();
    });
});

router.get('/list', function(req, res, next) {

    req.db.query("SELECT ln.lightnovel_id, ln.title, ln.author FROM lightnovels ln;", function(err, rows) {
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

    var query = "SELECT * FROM lightnovels ln INNER JOIN lightnovels_genres lng ON ln.lightnovel_id = lng.lightnovel_id INNER JOIN genres g ON lng.genre_id = g.genre_id WHERE ln.lightnovel_id=?";
    //query += req.db.escape(req.params.lnId);

    req.db.query(query, [ req.params.lnId ], function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        // Formats the query results into a single javascript object because query  returns with the number of rows equal to the number of genres a light novel is a part of.
        var result = {
            "title": rows[0].title,
            "author": rows[0].author,
            "description": rows[0].description,
            "completed": rows[0].completed ? true : false,
            "translatorSite": rows[0].translator_site,
            "genres": []
        };

        for (var i = 0; i < rows.length; ++i) {
            result.genres.push(rows[i].genre_name);
        }

        res.json(result);
    });
});

router.get("/exists/:lnTitle", function(req, res, next) {
    var query = "SELECT EXISTS(SELECT 1 FROM lightnovels WHERE title=?) AS exist";

    req.db.query(query, [ req.params.lnTitle ], function(err, rows) {
        if (err) throw err; // TODO: handle MySQL errors more gracefully

        var result= {
            "exists": rows[0].exist == 1
        };

        res.json(result);
    });
});

module.exports = router;