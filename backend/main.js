const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

const main = express();

mongoose.connect("mongodb+srv://Hyacin:" + process.env.MONGO_ATLAS_PW + "@cluster0.lobuo.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection Error!');
  });

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use("/images", express.static(path.join('backend/images')));

main.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

main.use("/", express.static(path.join(__dirname, "../dist/mean-stack")));

main.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mean-stack/index.html"));
});

main.use("/api/posts", postsRoutes);
main.use("/api/user", userRoutes);

module.exports = main;
