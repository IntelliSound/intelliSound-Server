const {Router} = require('express');
const jsonParser = require('body-parser').json();
const User = require('../models/user');

const userRouter = module.exports = new Router();

userRouter.post(`/signup`, jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password){
    throw new Error(`invalid request`);
  }

  return User.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});

userRouter.get(`/login`, (request, response, next) => {
  return response.json('the GET request worked');
});
