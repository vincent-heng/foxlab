var prompt = require('prompt'); // https://www.npmjs.com/package/prompt
var log = require('log');
var express = require('express');
var bodyParser = require('body-parser');
const winston = require('winston');
var fs = require('fs');
var request = require('request');

var config = require('./config');

winston.level = config.log.level;

var app = express();
var port = process.env.PORT || config.foxlab.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes/routes');
routes(app);

app.listen(port);
winston.info('Foxlab API server started on: ' + port);
