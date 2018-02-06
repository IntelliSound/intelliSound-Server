const waveParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');
const neuralNetwork = require('../lib/neural-net');
const fsx = require('fs-extra');


describe('Neural Network Test', () => {
  test('should behave by outputting predicted numbers from the wave file series', () => {
    const inputFilePath = `${__dirname}/../assets/one_hundred_ms_sin.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        const parsedFile = waveParser(data);
        parsedFile.neuralTransformedArray = neuralNetwork(parsedFile);
        console.log(parsedFile.neuralTransformedArray);
        fsx.writeFile('temp/transformed.wav', waveWriter(parsedFile));
        expect(parsedFile.neuralTransformedArray.length).toBeTruthy();
      });
  });
});

