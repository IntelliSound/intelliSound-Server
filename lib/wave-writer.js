'use strict';

// Andrew - This module takes an object which has been passed as input to the neural-net
//          module. It is expecting that the new data added from the neural net is
//          attached to that object as an array called 'neuralTransformedArray'.

module.exports = neuralProcessedWave => {
  // console.log(neuralProcessedWave.neuralTransformedArray.slice(1000, 2000), neuralProcessedWave.neuralTransformedArray);

  const RIFF_HEADER_OFFSET = 0;
  const FILE_SIZE_OFFSET = 4;
  const SUBCHUNK2_OFFSET = 36;
  const SUBCHUNK2_SIZE_OFFSET = 40;
  const WAVE_DATA_OFFSET = 44;

  const SUBCHUNK1_SIZE = 36;
  const SUBCHUNK2_HEADER_SIZE = 8;

  const neuralWaveArrayLength = neuralProcessedWave.neuralTransformedArray.length;
  const subChunk2Size = (neuralWaveArrayLength * 2) + SUBCHUNK2_HEADER_SIZE;

  const newFile = Buffer.alloc(SUBCHUNK2_OFFSET + subChunk2Size);

  let newFileHeader = neuralProcessedWave.buffer.slice(RIFF_HEADER_OFFSET, WAVE_DATA_OFFSET);

  newFileHeader.writeUInt32LE(subChunk2Size + SUBCHUNK1_SIZE, FILE_SIZE_OFFSET);
  newFileHeader.writeUInt32LE(subChunk2Size, SUBCHUNK2_SIZE_OFFSET);

  for (let i = 0; i < WAVE_DATA_OFFSET; i++){
    let currentValue = newFileHeader.readUInt8(i);
    newFile.writeUInt8(currentValue, i);
  }

  const SIXTEEN_BIT_ZERO = 32768;
  const SIXTEEN_BIT_MAX = 65535;

  const restoredArray = neuralProcessedWave.neuralTransformedArray.map(value => {
    const restoredValue = Math.floor(value * SIXTEEN_BIT_MAX);
    const signedInteger = restoredValue - SIXTEEN_BIT_ZERO;
    return signedInteger;
  });

  const testBuffer = Buffer.alloc(SUBCHUNK2_OFFSET + subChunk2Size, 1);

  for (let i = 0; i < neuralWaveArrayLength; i++){
    if(isNaN(restoredArray[i]))
      testBuffer.writeInt16LE(restoredArray[i], WAVE_DATA_OFFSET + (2 * i));

    newFile.writeInt16LE(restoredArray[i], WAVE_DATA_OFFSET + (2 * i));
  }
  console.log(testBuffer.slice(298, 2000));
  return newFile;
};
