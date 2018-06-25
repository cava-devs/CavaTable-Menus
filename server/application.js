const express = require('express');
const path = require('path');
const db = require('../database/index');

const app = express();

app.use('/restaurant/:restaurantId', express.static(path.join(__dirname, '../public/index.html')));
app.use('/menusBundle.js', express.static(path.join(__dirname, '../public/dist/bundle.js')));

app.get('/menus/restaurant/:restaurantId/menu', (req, res) => {
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

app.post('/menus/restaurant/:restaurantId/menu', (req, res) => {
  db.post(req.params.restaurantId, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(201);
    }
  });
});

app.put('/menus/restaurant/:restaurantId/menu', (req, res) => {
  db.put(req.params.restaurantId, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(202);
    }
  });
});

app.delete('menu/restaurant/:restaurantId/menu', (req, res) => {
  db.delete(req.params.restaurantId, (err, result) => {
    if (err) {
      res.status(404);
    } else {
      res.status(204);
    }
  });
});

module.exports = app;
