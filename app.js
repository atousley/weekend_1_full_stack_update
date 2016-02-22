var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var people = require('./routes/people');
var last_person = require('./routes/last_person');
var salary_sum = require('./routes/salary_sum');
var change_status = require('./routes/change_status');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_1_update';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/people', people);
app.use('/last_person', last_person);
app.use('/salary_sum', salary_sum);
app.use('/change_status', change_status);

app.get('/*', function  (req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
