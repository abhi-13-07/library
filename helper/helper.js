const User = require('../models/user');
const imageMimieType = ['image/jpeg', 'image/png', 'image/gif'];

module.exports = {
	renderFormPage: async function (req, res, book, form, hasError = false) {
		try {
			const author = await User.findOne({ _id: req.user.id });
			const params = {
				author: author,
				book: book,
			};
			if (hasError) {
				if (form === 'edit') {
					params.error = 'Error While Updating Book';
				} else {
					params.error = 'Error While Creating Book';
				}
			}
			if (req.isAuthenticated()) {
				params.auth = true;
				params.user = req.user;
			}
			res.render(`books/${form}`, params);
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
	renderPage: function (req, res, page, params) {
		if (req.isAuthenticated()) {
			params.auth = true;
			params.user = user;
		}
		res.render(page, params);
	},
};
