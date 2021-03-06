const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');

const renderFormPage = require('../helper/helper').renderFormPage;
const saveCover = require('../helper/helper').saveCover;
const renderPage = require('../helper/helper').renderPage;

const restrictUnAuth = require('../middlewares/restrictions').restrictUnAuth;

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
		const params = {
			books: books,
			queryParams: req.query,
		};
		renderPage(req, res, 'books/index', params);
	} catch {
		res.redirect('/');
	}
});

// new book route: /books/new
router.get('/new', restrictUnAuth, async function (req, res) {
	renderFormPage(req, res, new Book(), 'new');
});

// create new book route: /books/new
router.post('/new', restrictUnAuth, async function (req, res) {
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
		res.redirect(`/books/${newBook.id}`);
	} catch (err) {
		console.log(err.message);
		renderPage(res, new Book(), true);
	}
});

router.get('/:id', async function (req, res) {
	try {
		const book = await Book.findById(req.params.id).populate('author').exec();
		const params = { book: book };
		renderPage(req, res, 'books/book', params);
	} catch (err) {
		console.log(err);
		res.redirect('/');
	}
});

router.get('/:id/edit', restrictUnAuth, async function (req, res) {
	try {
		const book = await Book.findById(req.params.id);
		if (req.user.id === book.author) {
			renderFormPage(req, res, book, 'edit');
		} else {
			req.flash('info', 'You are not allowed to access this page');
			res.redirect('/books');
		}
	} catch {
		res.redirect('/books');
	}
});

router.put('/:id', restrictUnAuth, async function (req, res) {
	let book = null;
	const {
		title,
		author,
		publishedAt,
		description,
		pages,
		coverImage,
	} = req.body;
	try {
		book = await Book.findById(req.params.id);
		book.title = title;
		book.author = author;
		book.publishedAt = new Date(publishedAt);
		book.description = description;
		book.noOfPages = pages;
		if (coverImage != null && coverImage !== '') {
			saveCover(book, coverImage);
		}
		await book.save();
		res.redirect(`/books/${book.id}`);
	} catch {
		if (book !== null) {
			renderFormPage(res, book, 'edit', true);
		} else {
			res.redirect('/books');
		}
	}
});

router.delete('/:id', restrictUnAuth, async function (req, res) {
	let book = null;
	try {
		book = await Book.findById(req.params.id);
		await book.remove();
		res.redirect('/books');
	} catch {
		if (books != null) {
			res.render('books/book', {
				book: book,
				error: 'Could not remove book',
			});
		} else {
			res.redirect('/');
		}
	}
});

module.exports = router;
