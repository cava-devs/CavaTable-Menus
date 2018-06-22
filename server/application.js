const express = require('express');
const path = require('path');
const db = require('../database/index');

const app = express();

app.use(express.json());

app.use( express.static(path.join(__dirname, '../public/index.html')));
app.use('/restaurant/:restaurantId', express.static(path.join(__dirname, '../public/index.html')));
app.use('/menusBundle.js', express.static(path.join(__dirname, '../public/dist/bundle.js')));

//CRUD Requests
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
  //console.log(req.body);
  res.send(req.body);
});

app.put('/menus/restaurant/:restaurantId/menu', (req, res) => {
  res.send(req.body);
});

app.delete('/menus/restaurant/:restaurantId/menu', (req, res) => {
  res.send(req.body);
});

module.exports = app;
