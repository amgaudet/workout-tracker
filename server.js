const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

//to be made
// const db = require('/models');

const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbnamehere", { useNewUrlParser: true });

app.listen(PORT, () => {
  //change log before pushing to server
  console.log(`App running at http:localhost:${PORT}`)
})