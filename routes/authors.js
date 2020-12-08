const router = require('express').Router();
const Author = require('../models/author');
const Book = require('../models/book');

const renderPage = require('../helper/helper').renderPage;

// get all authors route: /authors
router.get('/', async function (req, res) {
	const searchOptions = {};
	if (req.query.name !== null && req.query.name !== '') {
		searchOptions.name = new RegExp(req.query.name, 'i');
	}
	try {
		const authors = await Author.find(searchOptions);
		const params = { authors, name: req.query.name };
		renderPage(req, res, 'authors/index', params);
	} catch (err) {
		res.redirect('/');
	}
});

// new author route: /authors/new
router.get('/new', function (req, res) {
	const params = {};
	renderPage(req, res, 'authors/new', params);
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
		let books = await Book.find({ author: req.params.id }).limit(6).exec();
		const params = {
			author: author,
			books: books,
		};
		renderPage(req, res, 'authors/author', params);
	} catch {
		res.redirect('/');
	}
});

router.get('/:id/edit', async function (req, res) {
	try {
		const author = await Author.findById(req.params.id);
		const params = {
			author: author,
		};
		renderPage(req, res, 'author/edit', params);
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
		res.redirect(`/authors/${req.params.id}`);
	}
});

router.delete('/:id', async function (req, res) {
	try {
		const author = await Author.findById(req.params.id);
		await author.remove();
		res.redirect('/authors');
	} catch (err) {
		res.render('authors/index', {
			error: err,
			authors: await Author.find(),
		});
	}
});

module.exports = router;
