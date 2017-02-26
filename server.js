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

app.get('/scrape', function(req, res){
	request('http://www.cnn.com/', function(error, response, html){
		var $ = cheerio.load(html);

			$('article h3').each(function(i, element){
				var result = {};
				result.title = $(this).find('span').text();
				result.link = $(this).children('a').attr('href');
				//some CNN links already have http to an outside site otherwise they are CNN links.
				if(result.link.indexOf("http")<0){
					result.link = 'http://www.cnn.com' + result.link;
				}
				var entry = new Article (result);
				entry.save(function(err, doc){
					if (err) {
						console.log(err);
					}
				})
			})

			Article.find({}, function(err, doc){
				if (err) {
					console.log(err);
				} else {
					res.json(doc);
				}
			})
	})
});

app.get('/articles/:id', function(req, res){
	Article.findOne({'_id' : req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

app.post('/savednote/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id' : req.params.id}, {'note' : doc._id})
			.exec(function(err, doc){
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});









