const waveParser = require('./sound-data-parser');
const fsx = require('fs-extra');


describe('Neural Network Test', () => {
  test('should behave by outputting predicted numbers from the wave file series', () => {
    const inputFilePath = `${__dirname}/../assets/one_hundred_ms_sin.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        const parsedFile = waveParser(data);
        
      });
  });
});

