'use strict';

const {Layer, Network, Trainer} = require('synaptic');

// const LEARNING_RATE = .001;


const inputLayer = new Layer(16);
const hiddenLayer1 = new Layer(8);
const hiddenLayer2 = new Layer(8);
const hiddenLayer3 = new Layer(8);
const hiddenLayer4 = new Layer(8);
const hiddenLayer5 = new Layer(8);
const outputLayer = new Layer(1);



inputLayer.project(hiddenLayer1);
hiddenLayer1.project(hiddenLayer2);
hiddenLayer2.project(hiddenLayer3);
hiddenLayer3.project(hiddenLayer4);
hiddenLayer4.project(hiddenLayer5);
hiddenLayer5.project(outputLayer);

const myNetwork = new Network({
  input: inputLayer,
  hidden: [hiddenLayer1, hiddenLayer2, hiddenLayer3, hiddenLayer4, hiddenLayer5],
  output: outputLayer,
});

const trainer = new Trainer(myNetwork);
var trainingSet = [
  {
    input: [0,1],
    output: [1],
  },
  {
    input: [1,1],
    output: [2],
  },
  {
    input: [2,1],
    output: [3],
  },
  {
    input: [3,2],
    output: [5],
  },
];

trainer.train(trainingSet);
trainer.train(trainingSet,{
  rate: .001,
  iterations: 200000,
  error: .005,
  shuffle: false,
  log: 1000,
  cost: Trainer.cost.CROSS_ENTROPY,
});


//higher order functions for activate and propagate 
// let oldDate = new Date();
// console.log(oldDate);
// let dateReference = new Date(oldDate.getTime() + .05 * 60000);
// console.log(dateReference);

const predictor = (arr) => {
  let starttime = new Date ();
  let endtime = starttime;
  while ((endtime - starttime) <= 1000);
  {
    // code here
    let loopcount = loopcount + 1;
    endtime = new Date ();
  }
    
  

  // for (let i = 0; i < 10000; i++) {
  //   for (let j = 0; j < array.length - 2; j++){
  //     myNetwork.activate([array[j], array[j + 1]]);
  //     myNetwork.propagate(LEARNING_RATE, [array[j + 2]]);
  //   }
  // }
  // return myNetwork.activate([...array]);  
};

// let array2 = array.map(ele =>  ele / 2550);
// console.log(array2);
let arr = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 54, 88, 142, 230, 372, 602, 974];

console.log(predictor(arr));

module.exports = predictor;