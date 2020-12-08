const router = require('express').Router();
const Book = require('../models/book');

router.get('/', async function (req, res) {
	let books = [];
	try {
		books = await Book.find().sort({ createdAt: 'desc' }).limit(10);
		const params = {
			books: books,
		};
		if (req.isAuthenticated()) {
			params.auth = true;
			params.user = req.user;
		}
		res.render('index', params);
	} catch {
		res.redirect('/');
	}
});

module.exports = router;
