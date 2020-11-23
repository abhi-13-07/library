const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');

const renderFormPage = require('../helper/helper').renderFormPage;
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
	renderFormPage(res, new Book(), 'new');
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
		res.redirect(`/books/${newBook.id}`);
	} catch (err) {
		console.log(err.message);
		renderNewPage(res, new Book(), true);
	}
});

router.get('/:id', async function (req, res) {
	try {
		const book = await Book.findById(req.params.id).populate('author').exec();
		res.render('books/book', { book: book });
	} catch (err) {
		console.log(err);
		res.redirect('/');
	}
});

router.get('/:id/edit', async function (req, res) {
	try {
		const book = await Book.findById(req.params.id);
		renderFormPage(res, book, 'edit');
	} catch {
		res.redirect('/books');
	}
});

router.put('/:id', async function (req, res) {
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

router.delete('/:id', async function (req, res) {
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
