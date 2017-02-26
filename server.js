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