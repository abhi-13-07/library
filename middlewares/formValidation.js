const User = require('../models/user');

module.exports = async function (req, res, next) {
	const errors = [];
	const { name, email, password1, password2 } = req.body;
	if (
		name === null ||
		email === null ||
		password1 === null ||
		password2 === null
	) {
		errors.push('Please enter all the fields');
	}
	if (password1.length < 6) {
		errors.push('Your Password is too small');
	}
	if (password1 !== password2) {
		errors.push('Password does not match');
	}

	try {
		const user = await User.findOne({ email: new RegExp(email, 'i') });
		if (!user) {
			if (errors.length === 0) {
				return next();
			}
			req.flash('error', errors);
			return res.redirect('/users/register');
		}
		errors.push('Email id already Exists');
		req.flash('error', errors);
		return res.redirect('/users/login');
	} catch (err) {
		console.log(err);
		res.redirect('/users/register');
	}
};
