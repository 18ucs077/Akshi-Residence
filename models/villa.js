var mongoose = require('mongoose');

// now we neend to setup our schema
var villaschema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  contact: Number,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// now we compile it into a model
module.exports = mongoose.model('Villa', villaschema);
