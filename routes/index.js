var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
    var select = "SELECT * FROM genres";

    var d = req.db.query(select, function(err, rows) {
        if (err) throw err;

        res.json(rows);

        for (var i = 0; i < rows.length; ++i) {
            console.log(rows[i]);
        }
        res.end(rows);
    })
});

router.post('/newGenre/:genrename', function(req, res, next) {
    var query = "INSERT INTO genres (name) VALUES (" + req.params.genrename + ");";
});

module.exports = router;
