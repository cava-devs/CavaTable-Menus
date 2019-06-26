const mongoose = require('mongoose');

const mongoURL = process.env.mongoURL || 'mongodb://localhost/cavatable_menus';

mongoose.connect(mongoURL);

const menuSchema = new mongoose.Schema({
  rest_id: Number,
  rest_name: String,
  breakfast: [{
    menu_section: String,
    entries: [{
      name: String,
      desc: String,
      price: String,
      photoUrl: String,
      filter_categories: {},
    }],
  }],
  lunch: [{
    menu_section: String,
    entries: [{
      name: String,
      desc: String,
      price: String,
      photoUrl: String,
      filter_categories: {},
    }],
  }],
  dinner: [{
    menu_section: String,
    entries: [{
      name: String,
      desc: String,
      price: String,
      photoUrl: String,
      filter_categories: {},
    }],
  }],
});

const MenuModel = mongoose.model('menus', menuSchema);

const retrieve = (restaurantId, handleResponse) => {
  console.log(restaurantId);
  MenuModel.find({ rest_id: parseInt(restaurantId) })
    .then(results => handleResponse(null, results))
    .catch(err => handleResponse(err, null));
};

module.exports = {
  retrieve: retrieve,
  MenuModel: MenuModel
};

