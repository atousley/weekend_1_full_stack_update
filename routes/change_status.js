var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_1_update';
}

router.post('/', function(req, res) {
    var addPerson = {
        person: req.body.person
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE people SET status = false WHERE id_num = " + addPerson.person,
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