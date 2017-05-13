var prompt = require('prompt'); // https://www.npmjs.com/package/prompt
var log = require('log');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config');

var app = express();
var port = process.env.PORT || config.foxlab.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes/routes');
routes(app);

app.listen(port);
console.log('Foxlab API server started on: ' + port);
