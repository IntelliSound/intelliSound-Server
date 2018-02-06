const mongoose = require('mongoose');

const neuralNetworkSchema = mongoose.Schema({
  neuralNetwork: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('neuralNetwork', neuralNetworkSchema);
