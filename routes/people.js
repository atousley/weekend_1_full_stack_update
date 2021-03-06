var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_1_update';
}

router.get('/', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM people WHERE status = true ORDER BY id ASC;');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

router.post('/', function(req, res) {
    var addPerson = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        id_num: req.body.id_num,
        title: req.body.title,
        annual_sal: req.body.annual_sal
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO people (first_name, last_name, id_num, title, annual_sal, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [addPerson.first_name, addPerson.last_name, addPerson.id_num, addPerson.title, addPerson.annual_sal, true],
            function (err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

module.exports = router;