'use strict';

const fsx = require('fs-extra');
const soundDataParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');

describe('wave-writer', () => {

  test('should create new wave file based off data', () => {
    const inputFilePath = `${__dirname}/../assets/tri.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        const parsedFile = soundDataParser(data);
        parsedFile.neuralTransformedArray = [0.3, 0.5, 0.2, 0.1, 0.4, 0.7, 0.9, 0.2];
        const newFile = waveWriter(parsedFile);
        const newParsedFile = soundDataParser(newFile);
        expect(newParsedFile.subChunk2Size).toEqual(24);
        expect(newParsedFile.fileSize).toEqual(60);
      });
  });
});