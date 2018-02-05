const {Router} = require('express');
const jsonParser = require('body-parser').json();
// const User = require('../models/user');

const userRouter = module.exports = new Router();

userRouter.post(`/signup`, jsonParser, (request, response, next) => {
  if(request.length < 1){
    throw new Error('no request content');
  }
});

// userRouter.get();
