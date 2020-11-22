const Author = require('../models/author');
const Book = require('../models/book');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public', Book.coverImageBasePath);

module.exports = {
	renderNewPage: async function (res, book, hasError = false) {
		try {
			const authors = await Author.find({});
			const params = {
				authors: authors,
				book: book,
			};
			if (hasError) params.error = 'Error While Creating Book';
			res.render('books/new', params);
		} catch {
			res.redirect('/books');
		}
	},
	removeBookCover: function (filename) {
		fs.unlink(path.join(uploadPath, filename), function (err) {
			if (err) {
				console.error(err);
			}
		});
	},
};
