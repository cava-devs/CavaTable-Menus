const express = require('express');
const path = require('path');
const db = require('../database/index');
const sqlhelper = require('../database/postSQLhelper');
const app = express();

const helper = sqlhelper; // set SQL or NONSQL

app.use(express.json());

app.use( express.static(path.join(__dirname, '../public/index.html')));
app.use('/restaurant/:restaurantId', express.static(path.join(__dirname, '../public/index.html')));
app.use('/menusBundle.js', express.static(path.join(__dirname, '../public/dist/bundle.js')));

//CRUD Requests
app.get('/menus/restaurant/:restaurantId/menu', (req, res) => {
  console.log('invoked');
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

//get whole menu for a certain rest
app.get('/menus/restaurant/:restaurantId/menu2', (req,res) => {
  helper.getRestMenu(req.params.restaurantId, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//insert a new dish item for a restaurant
app.post('/menus/restaurant/:restaurantId/menu2', (req, res) => {
  //10000001, 'bbb1', 'breakfast1', '$40', 'http://lorempixel.com/640/480/food', 1, 2
  let data = req.body;
  helper.mappingTimeANDSection(data.sectionname, (err, result) => {
    if (err) {
      res.status(400).send('incorrect time name or section name');
    } else {
      data.timeid = result.time_id;
      data.sectionid = result.section_id;
    }
    helper.insertNewDish(data, (error, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).send('created');
      }
    });
  });
});

app.put('/menus/restaurant/:restaurantId/menu', (req, res) => {
  res.send(req.body);
});

app.delete('/menus/restaurant/:restaurantId/menu', (req, res) => {
  res.send(req.body);
});

module.exports = app;


//post request 
// {
//   "restid": 10000000,
//   "dishname":"testing",
//   "dishdesc":"Soluta at quod non ullam quasi.",
//   "price":"$33.00",
//   "photourl":"http://lorempixel.com/640/480/food",
//   "timename":"Breakfast",
//   "sectionname":"Eggs"
// }