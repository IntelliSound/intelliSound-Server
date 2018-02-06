'use strict';

const {Layer, Network, Trainer} = require('synaptic');


const LEARNING_RATE = .01;


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


// const trainer = new Trainer(myNetwork);
// var trainingSet = [
//   {
//     input: [0,1],
//     output: [1],
//   },
//   {
//     input: [1,1],
//     output: [2],
//   },
//   {
//     input: [2,1],
//     output: [3],
//   },
//   {
//     input: [3,2],
//     output: [5],
//   },
// ];

// trainer.train(trainingSet);
// trainer.train(trainingSet,{
//   rate: .001,
//   iterations: 200000,
//   error: .005,
//   shuffle: false,
//   log: 1000,
//   cost: Trainer.cost.CROSS_ENTROPY,
// });



const predictor = (dataToProcess) => {
  const outputArray = [];
  const arrayToProcess = dataToProcess.neuralArray;

  let theTime = Date.now();
  let endTime = theTime + 2000;
  while(endTime - theTime > 0){
    
    for (let i = 0; i < arrayToProcess.length - 128; i++){
     
      const currentValues = [];
      for(let j = 0; j < 16; j++){

        currentValues.push(outputArray[i + (j * 8)]);

      }
      myNetwork.activate([...currentValues]);
      myNetwork.propagate(LEARNING_RATE, i + 128);
    }

    theTime = Date.now();
  }

  outputArray.push(...arrayToProcess.slice(-128));
 
  for (let i = 0; i < arrayToProcess.length * 2; i++) {
    const currentValues = [];
    for(let j = 0; j < 16; j++){

      currentValues.push(outputArray[i + (j * 8)]);

    }
    outputArray.push(myNetwork.activate([...currentValues])[0]);
  }

  return outputArray;
};


module.exports = predictor;