if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');

const passportLocalStrategy = require('./config/localStrategy');
passportLocalStrategy(passport);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));
app.use(
	session({
		secret: process.env.SESSION_SECRECT,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// connection to database
mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((conn) => console.log(conn.connection.host))
	.catch((err) => console.log(err.message));

// setting up routes
app.use('/', express.static('public'));
app.use('/', indexRouter);

app.use('/authors', express.static('public'));
app.use('/authors/:id/edit', express.static('public'));
app.use('/authors', authorsRouter);

app.use('/books', express.static('public'));
app.use('/books/:id/edit', express.static('public'));
app.use('/books', booksRouter);

app.use('/users', express.static('public'));
app.use('/users/:id/edit', express.static('public'));
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000, () =>
	console.log('Server is running on port 3000')
);
