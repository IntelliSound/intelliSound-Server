'use strict';

module.exports = neuralProcessedWave => {

  const RIFF_HEADER_OFFSET = 0;
  const FILE_SIZE_OFFSET = 4;
  const SUBCHUNK2_OFFSET = 36;
  const SUBCHUNK2_SIZE_OFFSET = 40;
  const WAVE_DATA_OFFSET = 44;

  const SUBCHUNK1_SIZE = 36;

  const neuralWaveArrayLength = neuralProcessedWave.neuralTransformedArray.length;
  const subChunk2Size = (neuralWaveArrayLength * 2) + 8;

  const newFile = Buffer.alloc(SUBCHUNK2_OFFSET + subChunk2Size);

  let newFileHeader = neuralProcessedWave.buffer.slice(RIFF_HEADER_OFFSET, SUBCHUNK2_OFFSET);

  newFileHeader.writeUInt32LE(FILE_SIZE_OFFSET, subChunk2Size + SUBCHUNK1_SIZE);
  newFileHeader.writeUInt32LE(SUBCHUNK2_SIZE_OFFSET, subChunk2Size);

  for (let i = 0; i < SUBCHUNK2_OFFSET; i++){
    let currentValue = newFileHeader.readUInt8(i);
    newFile.writeUInt8(i, currentValue);
  }

  const SIXTEEN_BIT_ZERO = 32768;
  const SIXTEEN_BIT_MAX = 65535;

  const restoredArray = neuralProcessedWave.neuralTransformedArray.map(value => {
    const restoredValue = Math.floor(value * SIXTEEN_BIT_MAX);
    const signedValue = restoredValue - SIXTEEN_BIT_ZERO;
    return signedValue;
  });

  for (let i = 0; i < neuralWaveArrayLength; i++){
    newFile.writeInt16LE(WAVE_DATA_OFFSET + (2 * i), restoredArray[i]);
  }

  return newFile;
};