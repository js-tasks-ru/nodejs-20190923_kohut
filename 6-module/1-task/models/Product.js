const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: [{
      validator: (price) => {
        return price > 0;
      },
      message: 'price should be more then 0',
    }],
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  images: [
    String,
  ],
});

module.exports = connection.model('Product', productSchema);
