module.exports = {
	restrictAuth: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/');
		} else {
			next();
		}
	},
	restrictUnAuth: function (req, res, next) {
		if (!req.isAuthenticated()) {
			res.redirect('/users/login');
		} else {
			next();
		}
	},
};
