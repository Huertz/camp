const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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

//! implememts ejs to server.js
app.set('view engine', 'ejs');
//! default view path
app.set('views', path.join(__dirname, 'views'));

//! renders the page on views
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makecamp', async (req, res) => {
  const camp = new Campground({
    title: 'my backyard',
    description: 'cheap',
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log('serving on port 3000');
});
