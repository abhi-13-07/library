const mongoose = require('mongoose');

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
		type: Buffer,
		required: true,
	},
	coverImageType: {
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
	if (this.coverImage !== null && this.coverImageType !== null) {
		return `data:${
			this.coverImageType
		};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
	}
});

module.exports = mongoose.model('Book', bookSchema);
