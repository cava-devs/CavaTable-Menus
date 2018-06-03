const mongoose = require('mongoose');
const menusData = require('./data.js');

mongoose.connect('mongodb://localhost/cavatable_menus');

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
      sort_categories: [{
        category: String,
      }],
    }],
  }],
  lunch: [{
    menu_section: String,
    entries: [{
      name: String,
      desc: String,
      price: String,
      photoUrl: String,
      sort_categories: [{
        category: String,
      }],
    }],
  }],
  dinner: [{
    menu_section: String,
    entries: [{
      name: String,
      desc: String,
      price: String,
      photoUrl: String,
      sort_categories: [{
        category: String,
      }],
    }],
  }],
});

const MenuModel = mongoose.model('Menu', menuSchema);

MenuModel.remove({})
  .then(() => MenuModel.insertMany(menusData))
  .then(() => console.log('Successfully stored data in database'))
  .catch(err => console.log(err));

const retrieve = (restaurantId, handleResponse) => {
  MenuModel.find({ rest_id: restaurantId })
    .then(results => handleResponse(null, results))
    .catch(err => handleResponse(err, null));
};

module.exports.retrieve = retrieve;

