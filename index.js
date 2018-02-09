'use strict';
require('dotenv').config();

const server = require('./lib/server');
server.start();
console.log(`server is running on port ${process.env.PORT}`);
