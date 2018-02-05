const {Router} = require('express');
const jsonParser = require('body-parser').json();
// const User = require('../models/user');

const userRouter = module.exports = new Router();

userRouter.post(`/signup`, jsonParser, (request, response) => {
  if(!request.body){
    throw new Error(`invalid request`);
  }
  return response.json(`the POST request worked`);
});

userRouter.get(`/login`, (request, response) => {
  console.log(`get ran`);
  if(!request.body){
    throw new Error(`invalid request`);
  }
  return response.json('the GET request worked');
});
