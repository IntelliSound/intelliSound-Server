'use strict';

const fsx = require('fs-extra');
const soundDataParser = require('../lib/sound-data-parser');

describe('sound-data-parser', () => {
  test('should return constructedWaveFile which contains buffer and other data attached', () => {
    const inputFilePath = `${__dirname}/../assets/one_hundred_ms_sin.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        const parsedFile = soundDataParser(data);
        expect(parsedFile.buffer).toBeTruthy();
        expect(parsedFile.numberOfChannels).toEqual(1);
        expect(parsedFile.sampleRate).toEqual(44100);
        expect(parsedFile.bitsPerSample).toEqual(16);
        expect(parsedFile.subChunk2Size).toEqual(11126);
        expect(parsedFile.data).toBeTruthy();
      });

  });

  test('should return error if file is not a RIFF', () => {
    const inputFilePath = `${__dirname}/assets/bad1.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('incorrect file type, must be RIFF format');
      });
  });

  test('should return error if file is too big', () => {
    const inputFilePath = `${__dirname}/assets/bad2.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('file too large, please limit file size to less than 10MB');
      });
  });

  test('should return error if file is not a WAVE', () => {
    const inputFilePath = `${__dirname}/assets/bad3.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('file must be a WAVE');
      });
  });

  test('should return error subChunk1 is not fmt', () => {
    const inputFilePath = `${__dirname}/assets/bad4.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('the first subchunk must be fmt');
      });
  });

  test('should return error if audio is not linear PCM encoded', () => {
    const inputFilePath = `${__dirname}/assets/bad5.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('wave file must be uncompressed linear PCM');
      });
  });

  test('should return error if file has more than 2 channels', () => {
    const inputFilePath = `${__dirname}/assets/bad6.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('wave file must have 2 or less channels');
      });
  });

  test('should return error if file has a sample rate higher than 48kHz', () => {
    const inputFilePath = `${__dirname}/assets/bad7.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('wave file must have sample rate of less than 48k');
      });
  });

  test('should return error if file does not have an even bitDepth (8 or 16 bits)', () => {
    const inputFilePath = `${__dirname}/assets/bad8.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow(`file's bit depth must be 16`);
      });
  });

  test('should return error if subChunk2 is not data', () => {
    const inputFilePath = `${__dirname}/assets/bad9.wav`;

    return fsx.readFile(inputFilePath)
      .then(data => {
        expect(() => soundDataParser(data)).toThrow('subchunk 2 must be data');
      });
  });

});
