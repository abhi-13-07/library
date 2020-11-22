const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Author = require('../models/author');
const Book = require('../models/book');

const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const removeBookCover = require('../helper/helper').removeBookCover;
const renderNewPage = require('../helper/helper').renderNewPage;

const upload = multer({
	dest: uploadPath,
	fileFilter: function (req, file, callback) {
		callback(null, imageMimeTypes.includes(file.mimetype));
	},
});

// get all books route: /books
router.get('/', async function (req, res) {
	let query = Book.find();
	if (req.query.title !== null && req.query.title !== '') {
		query = query.regex('title', new RegExp(req.query.title, 'i'));
	}
	if (req.query.publishedBefore !== null && req.query.publishedBefore !== '') {
		query = query.lte('publishedAt', req.query.publishedBefore);
	}
	if (req.query.publishedAfter !== null && req.query.publishedAfter !== '') {
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
router.post('/new', upload.single('coverImage'), async function (req, res) {
	const { title, author, date, description, pages } = req.body;
	const book = new Book({
		title: title,
		author: author,
		noOfPages: pages,
		description: description,
		coverImage: req.file !== null ? req.file.filename : null,
		publishedAt: new Date(date),
	});
	try {
		const newBook = await book.save();
		// res.redirect(`/books/${newBook.id}`);
		res.redirect('/books');
	} catch {
		if (book.coverImage != null) {
			removeBookCover(book.coverImage);
		}
		renderNewPage(res, new Book(), true);
	}
});

module.exports = router;
