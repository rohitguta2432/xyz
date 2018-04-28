var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



// Routes to render
var index = require('./routes/index');
var routeBackend = require('./routes/routeBackend');

var app = express();
var methodOverride = require('method-override');

function entryExit(req,res,next){
	console.log("***************************");
	console.log("Request type: " + req.method + " with url: " + req.url + " at", new Date());
	console.log("***************************");
	next();
}


//use to track entry exit of a URL
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(entryExit);
app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
	extended : true
}));

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


app.use(express.static(path.join(__dirname + '/public/socioseer')));
// all URLs declare here
app.use('/api', routeBackend);

app.get('/omtest', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/socioseer', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
