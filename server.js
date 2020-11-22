if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));

// connection to database
mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((conn) => console.log(conn.connection.host))
	.catch((err) => console.log(err.message));

// setting up routes
app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

app.listen(process.env.PORT || 3000, () =>
	console.log('Server is running on port 3000')
);
