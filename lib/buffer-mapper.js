'use strict';

//Andrew - This module is going to accept a parsed wave-file and output an array of values corresponding to the data subchunk in a format which can be accepted as input to the neural network.

const SIXTEEN_BIT_ZERO = 32768;
const SIXTEEN_BIT_MAX = 65535;

module.exports = parsedWave => {
  parsedWave.neuralArray = [];
  for (let i = 0; i < parsedWave.data.length; i += 2) {
    const sample = parsedWave.data.readInt16LE(i);
    const unsignedSample = sample + SIXTEEN_BIT_ZERO; 
    const sigmoidSample = unsignedSample / SIXTEEN_BIT_MAX;
    parsedWave.neuralArray.push(sigmoidSample);
  }
  return parsedWave;
};