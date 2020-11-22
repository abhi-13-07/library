const router = require('express').Router();
const Book = require('../models/book');

router.get('/', async function (req, res) {
	let books = [];
	try {
		books = await Book.find().sort({ createdAt: 'desc' }).limit(10);
		res.render('index', {
			books: books,
		});
	} catch {
		res.redirect('/');
	}
});

module.exports = router;
