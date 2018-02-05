'use strict';

const {Layer, Network, Trainer, Neuron} = require('synaptic');

const inputLayer = new Layer(2);
const hiddenLayer = new Layer(8);
const hiddenLayer2 = new Layer(4);
const outputLayer = new Layer(1);
const trainer = new Trainer(myNetwork);


inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const myNetwork = new Network({
  input: inputLayer,
  hidden: [hiddenLayer, hiddenLayer2],
  output: outputLayer,
});

var trainingSet = [
  {
    input: [0,1],
    output: [1],
  },
  {
    input: [1,2],
    output: [1],
  },
  {
    input: [2,1],
    output: [3],
  },
  {
    input: [3,2],
    output: [0],
  },
];

trainer.train(trainingSet);

trainer.train(trainingSet,{
  rate: .01,
  iterations: 200000,
  error: .005,
  shuffle: false,
  log: 1000,
  cost: Trainer.cost.CROSS_ENTROPY,
});

const LEARNING_RATE = .001;

const predictor = array => {
  for (let i = 0; i < 100000; i++) {
    for (let j = 0; j < array.length - 2; j++){
      myNetwork.activate([array[j], array[j + 1]]);
      myNetwork.propagate(LEARNING_RATE, [array[j + 2]]);
    }
  }
  return myNetwork.activate([array[array.length - 2], array[array.length - 1]]);  
};
let array = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 54, 88, 142, 230, 372, 602, 974, 1576];
let array2 = array.map(ele => ele / 1576);
console.log(predictor(array2) * 1576);

module.exports = predictor;