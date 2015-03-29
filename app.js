/**
 * Ref:
 * Secure express https://blog.liftsecurity.io/2012/12/07/writing-secure-express-js-apps
 * npm install helmet --save
 */

var port     = process.env.PORT || 8080;
var hostname = process.env.HOSTNAME || 'localhost';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session  = require('express-session');
var flash    = require('connect-flash');
var csurf    = require('csurf');
var app = express();

var configDB = require('./config/database.js');
require('./config/passport')(passport); // pass passport for configuration

///////////////////////////////////////////////////////////////////////////////
// mongoose ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
require('./models/Posts');
require('./models/Comments');
require('./models/BloodPressureHeartRate');

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
app.use(favicon(path.join(__dirname,'public','img','favicon.ico'))); // favicon of server
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false })); // Use querystring library when false), use the qs library when true).
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static(path.join(__dirname, 'public'))); // static page
app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components'))); // bower static lib

// passport
app.use(session({
	secret: 'itisasecretok',
	cookie: {
		/*
		httpOnly: true,
		secure: true, 
		*/
		//maxAge: 6000000
	}
})); // session secret
//app.use(express.csrf()); // Cross-Site Request Forgery (CSRF) Protection
// https://www.npmjs.com/package/csurf
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// route
require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/', require('./routes/index'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/wall', require('./routes/wall'));
app.use('/users', require('./routes/users'));
app.use('/bphr', require('./routes/bphr'));

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
