const router = require('express').Router();
const { findByIdAndDelete } = require('../models/author');
const Author = require('../models/author');
const Book = require('../models/book');

// get all authors route: /authors
router.get('/', async function (req, res) {
	const searchOptions = {};
	if (req.query.name !== null && req.query.name != '') {
		searchOptions.name = new RegExp(req.query.name, 'i');
	}
	try {
		const authors = await Author.find(searchOptions);
		res.render('authors/index', { authors, name: req.query.name });
	} catch (err) {
		res.redirect('/');
	}
});

// new author route: /authors/new
router.get('/new', function (req, res) {
	res.render('authors/new');
});

// create new author route: /authors/new
router.post('/new', async function (req, res) {
	const name = req.body.name;
	const author = new Author({
		name: name,
	});
	try {
		const newAuthor = await author.save();
		res.redirect(`/authors/${newAuthor.id}`);
	} catch {
		res.render('authors/new', {
			error: 'An Error Occured While Creating Author',
		});
	}
});

router.get('/:id', async function (req, res) {
	try {
		const author = await Author.findById(req.params.id);
		let books = await Book.find();
		books = books.filter((book) => book.author.toString() == author._id);
		res.render('authors/author', {
			author: author,
			books: books,
		});
	} catch {
		res.redirect('/');
	}
});

router.get('/:id/edit', async function (req, res) {
	try {
		const author = await Author.findById(req.params.id);
		res.render('authors/edit', { author: author });
	} catch {
		res.redirect('/');
	}
});

router.put('/:id', async function (req, res) {
	try {
		const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, {
			name: req.body.name,
		});
		res.redirect(`/authors/${updatedAuthor._id}`);
	} catch {
		res.redirect('/');
	}
});

router.delete('/:id', async function (req, res) {
	try {
		await Author.findByIdAndDelete(req.params.id);
		res.redirect('/authors');
	} catch {
		res.render('authors/index', {
			error: 'Error while deleting author',
			authors: await Author.find(),
		});
	}
});

module.exports = router;
