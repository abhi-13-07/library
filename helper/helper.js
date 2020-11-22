const Author = require('../models/author');
const imageMimieType = ['image/jpeg', 'image/png', 'image/gif'];

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
	saveCover: function (book, coverEncoded) {
		if (coverEncoded == null) return;
		const cover = JSON.parse(coverEncoded);
		if (cover !== null && imageMimieType.includes(cover.type)) {
			book.coverImage = new Buffer.from(cover.data, 'base64');
			book.coverImageType = cover.type;
		}
	},
};
