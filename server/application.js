require('newrelic');
const express = require('express');
const cluster = require('cluster');
const redis = require('redis');
const path = require('path');
const db = require('../database/index');
const sqlhelper = require('../database/postSQLhelper');

const client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

const app = express();

// Code to run if we're in the master process
if (cluster.isMaster) {

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;//4

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }

// Code to run if we're in a worker process
} else {

  const helper = sqlhelper; // set SQL or NONSQL

  app.use(express.json());

  app.use( express.static(path.join(__dirname, '../public/index.html')));

  app.use('/restaurant/:restaurantId', 
    express.static(path.join(__dirname, '../public/index.html')));
  app.use('/menusBundle.js', 
    express.static(path.join(__dirname, '../public/dist/bundle.js')));

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

  //get whole menu for a certain rest//only get the data based on choice of breakfast/lunch/dinner
  app.get('/menus/restaurant/:restaurantId/menu2/:timeId', (req,res, next) => {
    let restaurantId = req.params.restaurantId;
    let timeId = req.params.timeId;
    let key = `${restaurantId}&${timeId}`; 
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

  app.put('/menus/restaurant/:menuID/menu2', (req, res) => {
    let data = req.body;
    helper.updateDish(req.params.menuID, data, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send('Updated');
      }
    });
  });

  app.delete('/menus/restaurant/:menuID/menu2', (req, res) => {
    helper.deleteDish(req.params.menuID, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send('Deleted');
      }
    });
  });

  const port = process.env.PORT || 3005;
  app.listen(port, () => console.log(`Menu module listening on port ${port}`));

}

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

//get request
// [
//   {
//       "dish_name": "sit",
//       "dish_desc": "Dolorem cupiditate quod consequatur molestias nobis.",
//       "price": "$984.00",
//       "photo_url": "http://lorempixel.com/640/480/food",
//       "meal_time": "Breakfast",
//       "section_name": "Eggs",
//       "dietary_type": {
//           "Gluten-Free": true
//       },
//       "menu_id": "2751131"
//   },
//   {
//       "dish_name": "et",
//       "dish_desc": "Blanditiis magni quasi.",
//       "price": "$469.00",
//       "photo_url": "http://lorempixel.com/640/480/food",
//       "meal_time": "Breakfast",
//       "section_name": "Eggs",
//       "dietary_type": {
//           "Vegetarian": true
//       },
//       "menu_id": "2751133"
//   }
// ]

//put request
// {
//   "price": 128,
//   "dish_name": "black cod"
// }

//delete request
///menus/restaurant/275005641/menu2
