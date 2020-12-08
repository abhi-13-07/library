const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const formValidation = require('../middlewares/formValidation');
const restrictAuth = require('../middlewares/restrictions').restrictAuth;

// route users/login
router.get('/login', restrictAuth, function (req, res) {
	res.render('users/login');
});

router.post(
	'/login',
	restrictAuth,
	passport.authenticate('local', {
		successRedirect: '/',
		successFlash: "You've logged in successfully",
		failureRedirect: '/users/login',
		failureFlash: true,
	})
);

router.get('/register', restrictAuth, function (req, res) {
	res.render('users/register');
});

router.post(
	'/register',
	restrictAuth,
	formValidation,
	async function (req, res) {
		const { name, email, password1 } = req.body;
		const user = new User({
			name: name,
			email: email,
		});
		try {
			const salt = await bcrypt.genSalt(10);
			const hassedPassword = await bcrypt.hash(password1, salt);
			user.password = hassedPassword;
			await user.save();
			res.redirect('/users/login');
		} catch {
			res.redirect('/');
		}
	}
);

module.exports = router;
