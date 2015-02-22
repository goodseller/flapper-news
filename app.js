var port     = process.env.PORT || 8080;
var hostname = process.env.HOSTNAME || 'localhost';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session  = require('express-session');
var flash    = require('connect-flash');
var app = express();

var configDB = require('./config/database.js');
require('./config/passport')(passport); // pass passport for configuration

///////////////////////////////////////////////////////////////////////////////
// mongoose ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
require('./models/Posts');
require('./models/Comments');
mongoose.connect(configDB.url || 'mongodb://localhost/news'); // connect to our database

///////////////////////////////////////////////////////////////////////////////
// express ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// variables ===================================================================
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('env', 'development');

// set up ======================================================================
// set up express application
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false })); // Use querystring library when false), use the qs library when true).
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static(path.join(__dirname, 'public'))); // static page

// passport
app.use(session({ secret: 'itisasecretok' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// route
require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
var routesIndex = require('./routes/index');
var routesUser = require('./routes/users');

app.use('/', routesIndex);
app.use('/users', routesUser);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development' || app.get('env') === 'dev') {
	// development error handler
	// will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(port);

console.log('Server start on '+ hostname + ':' + port);

module.exports = app;
