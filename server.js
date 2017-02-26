var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger  = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

var database = {

	local : 'mongodb://localhost/...'
	remote : 'mongodb://...'
}

var whichDb = database.remote;
mongoose.connect(whichDb);

db = mongoose.connection;

db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});
db.once('open', function () {
	console.log('DB connection: ',whichDb);
});
var PORT = process.env.PORT || 8080;

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

