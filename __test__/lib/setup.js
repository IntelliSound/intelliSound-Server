'use strict';

const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SECRET_SALT = 'SECRET_SALT';
process.env.AWS_ACCESS_KEY_ID = 'secretkeyid';
process.env.AWS_BUCKET = 'mycoolbucket';
process.env.AWS_SECRET_ACCESS_KEY = 'mysecretkey';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('__ERROR__', 'key, bucket, body and ACL are required'));
  }

  if (params.ACL !== 'public-read') {
    return callback(new Error('__ERROR__', 'ACL should be public-read'));
  }

  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('__ERROR__', 'bucket is incorrect'));
  }

  callback(null, {Location: faker.internet.url()});
});
