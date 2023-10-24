if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//! express sessions
const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongodb-session')(session);

//! mongodb
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp';
// 'mongodb://localhost:27017/camp'
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);

//! implememts ejs to server.js
app.set('view engine', 'ejs');

//! directly connects to the view folder
app.set('views', path.join(__dirname, 'views'));

//! to parse body from req
app.use(express.urlencoded({ extended: true }));

//! used to override patch and delete as post
app.use(methodOverride('_method'));

//! directrly connects to the public folder
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoStore({
  url: dbUrl,
  secret: 'supersecret',
  touchAfter: 24 * 60 * 60,
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //? currentUser
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

//! renders the page on views
app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
