const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/index');

const app = express();
const port = process.env.PORT || 3005;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/restaurant/:restaurantId/menu', (req, res) => {
  db.retrieve(req.params.restaurantId, (err, results) => {
    if (err) {
      res.status(500).send(JSON.stringify('Unable to retrieve menu data from database'));
    } else {
      res.status(200).send(JSON.stringify(results));
    }
  });
});

app.listen(port, () => console.log(`Overview module listening on port ${port}`));