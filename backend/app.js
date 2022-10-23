const express = require('express'); // installed with npm (nodejs framework)
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://mkharoub:AB133GA4O2qfsYWy@cluster0.vgipknd.mongodb.net/angular-node?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((e) => {
    console.log("Connection to the database failed!", e);
  });

//use function here is a middleware used to handle some request
// app.use((req, res, next) => {
//   console.log("First Middleware")
//   next();
// });


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));// no need here, just an example of what the body parser could do for us
app.use('/images', express.static(path.join('backend/images'))); //super important, so we don't give the end user an access to the images folder!! with this simple we replace internally the path!!!!!
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');

  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;

