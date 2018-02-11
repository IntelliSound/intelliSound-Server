'use strict';

const {Network} = require('synaptic');
const waveParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');
const neuralNetwork = require('../lib/neural-net');
const fsx = require('fs-extra');


describe('Neural Network Test', () => {
  test('should behave by outputting predicted numbers from the wave file series', () => {
    const inputFilePath1 = `${__dirname}/../assets/sqr.wav`;
    const inputFilePath2 = `${__dirname}/../assets/saw.wav`;
    const outputFilePath = `${__dirname}/temp/transformed.wav`;
    let parsedFile;

    return fsx.readFile(inputFilePath1)
      .then(data => {
        parsedFile = waveParser(data);
        parsedFile = neuralNetwork(parsedFile);

        return fsx.readFile(inputFilePath2)
          .then(data => {
            let sawWave = waveParser(data);
            sawWave = neuralNetwork(sawWave, Network.fromJSON(parsedFile.neuralNet));
            fsx.writeFile(outputFilePath, waveWriter(sawWave));
            expect(parsedFile.neuralTransformedArray.length).toBeTruthy();
            expect(sawWave.neuralTransformedArray.length).toBeTruthy();
          });
      });
  }, 150000);
});
