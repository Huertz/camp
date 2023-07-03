// express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/camp', {
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

//! renders the page on views
app.get('/', (req, res) => {
  res.render('home');
});

//! show a campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

//! order does matter
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//! creates campground
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  //! redirect mostly used in POST
  res.redirect(`/campgrounds/${campground._id}`);
});

//! camp by id
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
});

//! edit camp by id
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

//! updates camp by id
//! can also used put
app.patch('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  //! redirect mostly used in POST
  res.redirect(`/campgrounds/${campground._id}`);
});

//! deletes camp by id for now..
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('serving on port 3000');
});
