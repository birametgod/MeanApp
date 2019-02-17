const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose
  .connect('mongodb+srv://birametgod:ID6nlTZu07PYxCbd@cluster0-c7tiq.mongodb.net/node-angular', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('Connection failed !');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next();
});
// 201 like 200 evrything is ok but new resource is created
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
