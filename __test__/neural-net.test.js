const waveParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');
const neuralNetwork = require('../lib/neural-net');
const fsx = require('fs-extra');


describe('Neural Network Test', () => {
  test('should behave by outputting predicted numbers from the wave file series', () => {
    const inputFilePath1 = `${__dirname}/../assets/trumpet.wav`;
    const inputFilePath2 = `${__dirname}/../assets/tri.wav`;
    const outputFilePath = `${__dirname}/temp/transformed.wav`;
    let parsedFile;

    return fsx.readFile(inputFilePath1)
      .then(data => {
        parsedFile = waveParser(data);
        parsedFile = neuralNetwork(parsedFile);

        // Andrew - make sure you create a temp folder in the __test__ folder, fs does not
        //          automatically create the folder, and temp is gitignored.
        return fsx.readFile(inputFilePath2)
          .then(data => {
            let triWave = waveParser(data);
            triWave = neuralNetwork(triWave, parsedFile.neuralNet);
            fsx.writeFile(outputFilePath, waveWriter(triWave));
            expect(parsedFile.neuralTransformedArray.length).toBeTruthy();
            expect(triWave.neuralTransformedArray.length).toBeTruthy();
          });
      });
  }, 15000);
});
