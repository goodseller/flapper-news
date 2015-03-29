// route middleware to ensure user is logged in
module.exports = function isLoggedIn(req, res, next) {
	console.log('----------------------------------------');
	console.log('passport.user: %s', req.session.passport.user);
	console.log('passport:  %s', req.session.passport);
	console.log('session: %s', req.session);
	console.log('----------------------------------------');

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}