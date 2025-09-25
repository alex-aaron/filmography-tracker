const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  films: {
    type: [Object],
    required: true
  }
});

module.exports = mongoose.model("Director", directorSchema);

