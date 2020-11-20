require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// connection to database
mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: false,
	})
	.then((conn) => console.log(conn.connection.host))
	.catch((err) => console.log(err.message));

// setting up routes
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () =>
	console.log('Server is running on port 3000')
);
