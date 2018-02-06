const {Layer, Network} = require('synaptic');
module.exports = {};

let inputLayer = new Layer(2);
let hiddenLayer = new Layer(3);
let outputLayer = new Layer(1);

inputLayer.project(hiddenLayer, Layer.connectionType.ALL_TO_ALL);
hiddenLayer.project(outputLayer, Layer.connectionType.ALL_TO_ALL);

let neuralNetwork = new Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer,
});

const learningRate = 0.3;
for(let i = 0; i < 200000; i++){
  neuralNetwork.activate([1,0]);
  neuralNetwork.propagate(learningRate, [1]);

  neuralNetwork.activate([0,1]);
  neuralNetwork.propagate(learningRate, [1]);

  neuralNetwork.activate([1,1]);
  neuralNetwork.propagate(learningRate, [0]);

  neuralNetwork.activate([0,0]);
  neuralNetwork.propagate(learningRate, [0]);
}

neuralNetwork.activate([0,0]);
neuralNetwork.activate([1,1]);
neuralNetwork.activate([1,0]);
neuralNetwork.activate([0,1]);

module.exports = neuralNetwork.toJSON();
