const express = require('express');
const path = require('path');
const db = require('../database/index');

const app = express();

app.use('/menusBundle.js', express.static(path.join(__dirname, '../public/dist/bundle.js')));

app.get('/restaurant/:restaurantId/menu', (req, res) => {
  db.retrieve(req.params.restaurantId, (err, results) => {
    if (err && err.message.includes('Cast to number failed for value "NaN"')) {
      res.status(400).json('Bad request');
    } else if (err) {
      res.status(500).json('Unable to retrieve menu data from database');
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = app;
