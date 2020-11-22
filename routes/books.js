const router = require('express').Router();
const Book = require('../models/book');

const renderNewPage = require('../helper/helper').renderNewPage;
const saveCover = require('../helper/helper').saveCover;

// get all books route: /books
router.get('/', async function (req, res) {
	let query = Book.find();
	if (req.query.title != null && req.query.title !== '') {
		query = query.regex('title', new RegExp(req.query.title, 'i'));
	}
	if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
		query = query.lte('publishedAt', req.query.publishedBefore);
	}
	if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
		query = query.gte('publishedAt', req.query.publishedAfter);
	}
	try {
		const books = await query.exec();
		res.render('books/index', {
			books: books,
			queryParams: req.query,
		});
	} catch {
		res.redirect('/');
	}
});

// new book route: /books/new
router.get('/new', async function (req, res) {
	renderNewPage(res, new Book());
});

// create new book route: /books/new
router.post('/new', async function (req, res) {
	const {
		title,
		author,
		publishedAt,
		description,
		pages,
		coverImage,
	} = req.body;

	const book = new Book({
		title: title,
		author: author,
		noOfPages: pages,
		description: description,
		publishedAt: new Date(publishedAt),
	});
	saveCover(book, coverImage);

	try {
		const newBook = await book.save();
		// res.redirect(`/books/${newBook.id}`);
		res.redirect('/books');
	} catch (err) {
		console.log(err.message);
		renderNewPage(res, new Book(), true);
	}
});

module.exports = router;
