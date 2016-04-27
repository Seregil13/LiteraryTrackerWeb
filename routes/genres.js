/**
 * Created by Alec on 3/22/2016.
 */

var express = require('express');
var router = express.Router();

router.post('/create', function (req, res, next) {
    // TODO: create new genre

    var genre = {
        genre_name: req.body.genre
    };

    var insert = "INSERT INTO ?? SET ?";

    req.db.query(insert, [ req.schema.genres.table_name, genre ], function (err, rows) {
        if (err) throw err;

        res.json({ succes: "true" });
    })
});

router.get('/list', function (req, res, next) {
    // TODO: list genres

    var query = "SELECT * FROM ??";

    req.db.query(query,  [ req.schema.genres.table_name ], function (err, rows) {
        if (err) throw err; // TODO: handle better

        var output = [];

        for (var i = 0; i < rows.length; ++i) {
            output.push(rows[i].genre_name);
        }
        res.json(output);
    })
});

module.exports = router;