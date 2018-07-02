require('newrelic');
const express = require('express');
const cluster = require('cluster');
const redis = require('redis');
const path = require('path');
const helper = require('../database/postSQLhelper');
const morgan = require('morgan');

const redisHOST = process.env.REDIS_HOST || '127.0.0.1';
const redisPORT = process.env.REDIS_PORT || '6379';
const client = redis.createClient(redisPORT, redisHOST); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

const app = express();


app.use(express.json());

app.use(express.static(path.join(__dirname, '../public/index.html')));

app.use('/restaurant/:restaurantId', 
  express.static(path.join(__dirname, '../public/index.html')));
app.use('/menusBundle.js', 
  express.static(path.join(__dirname, '../public/dist/bundle.js')));

app.get('/menus/restaurant/:restaurantId/menu/:timeId', (req,res, next) => {
  let restaurantId = req.params.restaurantId;
  let timeId = req.params.timeId;
  let key = `${restaurantId}&${timeId}`; 
  if (process.env.NODE_ENV === 'test') {
    helper.getRestMenu(restaurantId, timeId, (error, results) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send(results);
      }
    });
  } else {
    client.get(key, function (err, result) {
      if (result) {
        res.status(200).send(result);
      } else {
        helper.getRestMenu(restaurantId, timeId, (error, results) => {
          if (error) {
            res.status(400).send(error);
          } else {
            res.status(200).send(results);
            client.setex(key, 60 * 20, results);
          }
        });
      }
    });
  }
});

//insert a new dish item for a restaurant
app.post('/menus/restaurant/:restaurantId/menu', (req, res) => {
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

app.put('/menus/restaurant/:menuID/menu', (req, res) => {
  let data = req.body;
  helper.updateDish(req.params.menuID, data, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Updated');
    }
  });
});

app.delete('/menus/restaurant/:menuID/menu', (req, res) => {
  helper.deleteDish(req.params.menuID, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Deleted');
    }
  });
});

module.exports = app;
