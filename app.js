var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_1_update';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/people', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM people ORDER BY id ASC;');

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

app.get('/last_person', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM people ORDER BY id DESC LIMIT 1;');

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

app.get('/salary_sum', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT sum(annual_sal) as total_sal FROM people;');

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


app.post('/people', function(req, res) {
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

app.post('/change_status', function(req, res) {
    var addPerson = {
        person: req.body.person
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE people SET status = false WHERE id_num = person",
            [addPerson.person],
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

app.get('/*', function  (req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
