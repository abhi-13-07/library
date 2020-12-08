const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async function (email, password, done) {
				try {
					const user = await User.findOne({ email: new RegExp(email, 'i') });
					if (!user) {
						return done(null, false, { message: 'Email is not registred' });
					}
					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch) {
						return done(null, false, { message: 'Password does not match' });
					}
					return done(null, user);
				} catch (err) {
					console.log(err);
				}
			}
		)
	);
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};
