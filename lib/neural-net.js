'use strict';

const {Layer, Network} = require('synaptic');

// Andrew - experimented with different values and 0.3 seems to work best for this 
//          problem type/network architecture
const LEARNING_RATE = 0.3;

const myNetwork = () => {
  const inputLayer = new Layer(8);
  const hiddenLayer1 = new Layer(5);
  const outputLayer = new Layer(1);
  
  inputLayer.project(hiddenLayer1);
  hiddenLayer1.project(outputLayer);

  return new Network({
    input: inputLayer,
    hidden: [
      hiddenLayer1, 
    ],
    output: outputLayer,
  });
};

// Andrew - We are initializing the neural generated array with random noise:
const generateNoiseArr = () => {
  const noiseArr = [];
  for (let i = 0; i < 128; i++){
    noiseArr.push(Math.random());
  }
  return noiseArr;
};

const predictor = (dataToProcess, network = myNetwork(), seedArr = generateNoiseArr()) => {
  dataToProcess.neuralTransformedArray = seedArr;
  
  const arrayToProcess = dataToProcess.neuralArray;
  
  for(let rounds = 0; rounds < 50; rounds++){
    for (let i = 0; i < arrayToProcess.length - 128; i++){
      
      const currentValues = [];
      for(let j = 0; j < 8; j++){
        
        currentValues.push(arrayToProcess[i + (j * 16)]);
      }
      network.activate([...currentValues]);
      network.propagate(LEARNING_RATE, [arrayToProcess[i + 128]]);
    }
  }
  
  //Nicholas- this is where we set the length of the new file
  //Andrew - the new file will be some multiple of the original file's length, set here:
  const WAVE_LENGTH_MULTIPLE = 1;
  const NEURAL_PARSE_LENGTH = arrayToProcess.length * WAVE_LENGTH_MULTIPLE;
  for (let i = 0; i < NEURAL_PARSE_LENGTH; i++) {
    let currentValues = [];
    for(let j = 0; j < 8; j++){
      currentValues.push(dataToProcess.neuralTransformedArray[i + (j * 16)]);
    }
    dataToProcess.neuralTransformedArray.push(network.activate([...currentValues])[0]);
  }
  // Andrew - attaching the trained network to the output object for use in other modules
  // Andrew - The toJSON method deconstructs the network, but does not stringify it.
  dataToProcess.neuralNet = network.toJSON();

  return dataToProcess;
};

module.exports = predictor;
