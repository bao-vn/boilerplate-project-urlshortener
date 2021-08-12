require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const shortenerController = require('./controller/ShortenerController.js');
const app = express();

const TIMEOUT = 10000;
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get Schema from DB
const shortenerModel = shortenerController.shortenerModel;

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  // in case of incorrect function use wait timeout then respond
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);

  res.json({ greeting: 'hello API' });
});


// [POST]: save shortenerURL
app.post('/api/shorturl', (req, res, next) => {
  const originalURL = req.body.url;

  console.log('body param: ' + originalURL);
  console.log('body: ' + JSON.stringify(req.body));

  shortenerController.saveShortener(originalURL, (err, data) => {
    if (err) {
      return next(err);
    }

    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }

    res.send(data);
  })
});

// [GET] get original_url by short_url
app.get('/api/shorturl/:id', (req, res, next) => {
  const id = req.params.id;

  console.log(id);

  shortenerController.getShortenerByShortURL(id, (err, data) => {
    if (err) {
      return next(err);
    }

    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }

    // res.send(data);
    console.log(data[0].original_url);
    res.redirect(data[0].original_url);
  })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
