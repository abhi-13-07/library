const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

authorSchema.pre('remove', async function (next) {
	try {
		const books = await Book.find({ author: this._id });
		if (books.length > 0) {
			await Book.deleteMany({ author: this._id });
			next();
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

module.exports = mongoose.model('Author', authorSchema);
