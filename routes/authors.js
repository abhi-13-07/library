const router = require('express').Router();
const Author = require('../models/author');

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
		// res.redirect(`authors/${newAuthor.id}`);
		res.redirect(`/authors`);
	} catch {
		res.render('authors/new', {
			error: 'An Error Occured While Creating Author',
		});
	}
});

module.exports = router;
