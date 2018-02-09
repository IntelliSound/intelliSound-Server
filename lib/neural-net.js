'use strict';

const {Layer, Network} = require('synaptic');

// Andrew - experimented with different values and 0.3 seems to work best for this 
//          problem type/network architecture
const LEARNING_RATE = 0.3;

const inputLayer = new Layer(4);
const hiddenLayer1 = new Layer(2);
const hiddenLayer2 = new Layer(2);
const outputLayer = new Layer(1);

inputLayer.project(hiddenLayer1);
hiddenLayer1.project(hiddenLayer2);
hiddenLayer2.project(outputLayer);

const myNetwork = new Network({
  input: inputLayer,
  hidden: [
    hiddenLayer1, 
    hiddenLayer2,
  ],
  output: outputLayer,
});

const predictor = (dataToProcess, network = myNetwork) => {
  dataToProcess.neuralTransformedArray = [];
  
  const arrayToProcess = dataToProcess.neuralArray;
  
  for(let rounds = 0; rounds < 100; rounds++){
    for (let i = 0; i < arrayToProcess.length - 128; i++){
      
      const currentValues = [];
      for(let j = 0; j < 4; j++){
        
        currentValues.push(arrayToProcess[i + (j * 32)]);
      }
      network.activate([...currentValues]);
      network.propagate(LEARNING_RATE, [arrayToProcess[i + 128]]);
    }
  }
  
  // Andrew - We are initializing the neural generated array with random noise:
  for (let i = 0; i < 128; i++){
    dataToProcess.neuralTransformedArray.push(Math.random());
  }
  
  //Nicholas- this is where we set the length of the new file
  //Andrew - the new file will be some multiple of the original file's length, set here:
  const WAVE_LENGTH_MULTIPLE = 1;
  const NEURAL_PARSE_LENGTH = arrayToProcess.length * WAVE_LENGTH_MULTIPLE;
  for (let i = 0; i < NEURAL_PARSE_LENGTH; i++) {
    let currentValues = [];
    for(let j = 0; j < 4; j++){
      currentValues.push(dataToProcess.neuralTransformedArray[i + (j * 32)]);
    }
    dataToProcess.neuralTransformedArray.push(network.activate([...currentValues])[0]);
  }
  // Andrew - attaching the trained network to the output object for use in other modules
  // Andrew - The toJSON method deconstructs the network, but does not stringify it.
  dataToProcess.neuralNet = network.toJSON();

  return dataToProcess;
};

module.exports = predictor;
