const mongoose = require('mongoose');
const coverImageBasePath = 'uploads/bookCovers';
const path = require('path');

const bookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author',
		required: true,
	},
	noOfPages: {
		type: Number,
	},
	description: {
		type: String,
	},
	coverImage: {
		type: String,
		required: true,
	},
	publishedAt: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

bookSchema.virtual('coverImageLink').get(function () {
	if (this.coverImage !== null) {
		return path.join('/', coverImageBasePath, this.coverImage);
	}
});

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
