'use strict';

const {Layer, Network, Trainer} = require('synaptic');


const LEARNING_RATE = 0.01;


const inputLayer = new Layer(2);
const hiddenLayer1 = new Layer(3);
// const hiddenLayer2 = new Layer(2);
// const hiddenLayer3 = new Layer(2);
const outputLayer = new Layer(1);



inputLayer.project(hiddenLayer1);
// hiddenLayer1.project(hiddenLayer2);
// hiddenLayer2.project(hiddenLayer3);
hiddenLayer1.project(outputLayer);

const myNetwork = new Network({
  input: inputLayer,
  hidden: [hiddenLayer1],
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



const predictor = (dataToProcess, network = myNetwork) => {
  const WAVE_LENGTH_MULTIPLE = 2;
  dataToProcess.neuralTransformedArray = [];
  
  const arrayToProcess = dataToProcess.neuralArray;
  console.log(arrayToProcess);
  // console.log(network.clear());
  const smallest = Math.min(...arrayToProcess);
  arrayToProcess.forEach((e, i , a) => {
    const zero = e - smallest;
    a[i] = zero;
  });

  const largest = Math.max(...arrayToProcess);

  arrayToProcess.forEach((e, i, a) => {
    const one = e / largest;
    a[i] = one;
  });

  console.log(arrayToProcess);

  console.log(Math.max(...arrayToProcess), Math.min(...arrayToProcess));
  // let theTime = Date.now();
  // let endTime = theTime + 2000;
  // while(endTime - theTime > 0){
  for(let rounds = 0; rounds < 1000; rounds++){
    for (let i = 0; i < arrayToProcess.length - 2; i++){

      // const currentValues = [];
      // for(let j = 0; j < 4; j++){

      //   currentValues.push(arrayToProcess[i + j]);
      // }
      // console.log(currentValues);
      network.activate([arrayToProcess[i], arrayToProcess[i + 1]]);
      network.propagate(LEARNING_RATE, [i + 2]);
    }
    // console.log(arrayToProcess);
    // let arr = new Float64Array(1);
    // arr[0] = .01;
    // console.log(arr);
    // network.optimized.memory = arr;
    console.log(network);

    // theTime = Date.now();
  }
  // console.log(arrayToProcess.length);
  // console.log(arrayToProcess.slice(500, 505));
  // console.log(dataToProcess.neuralTransformedArray);
  dataToProcess.neuralTransformedArray = [...arrayToProcess.slice(-128)];
  // console.log(dataToProcess.neuralTransformedArray.length);

  //Nicholas- this is where we set the length of the new file
  const NEURAL_PARSE_LENGTH = arrayToProcess.length * WAVE_LENGTH_MULTIPLE;
  for (let i = 0; i < NEURAL_PARSE_LENGTH; i++) {
    // let currentValues = [];
    // for(let j = 0; j < 4; j++){

    //   currentValues.push(dataToProcess.neuralTransformedArray[i + j]);
    //   //Nicholas- ^ is where it breaks
    // }
    dataToProcess.neuralTransformedArray.push(network.activate([dataToProcess.neuralTransformedArray[i], dataToProcess.neuralTransformedArray[i + 1]])[0]);
    //this is generating nan every time. The first 128 are all from the original, arr[128] is nan and the first pushed value
    if(i === 134){
      // console.log(i, 'current values[0]: ', [...currentValues]);
      console.log(dataToProcess.neuralTransformedArray.slice(124, 136));
    }
  }

  // console.log(dataToProcess.neuralTransformedArray.slice(126, 130), dataToProcess.neuralTransformedArray.slice(252, 260));
  // console.log(dataToProcess.neuralTransformedArray.length);
  dataToProcess.neuralNet = network;
  return dataToProcess;
};


module.exports = predictor;
