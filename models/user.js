const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const httpErrors = require('http-errors');
const neuralNetwork = require('./neuralNetwork');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  OAuth: {
    type: Boolean,
    // required: true,
  },
  neuralNetworks: [
    {type: mongoose.Schema.Types.ObjectId,
      ref: 'neuralNetwork'}],
});

userSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(response => {
      if(!response){
        throw new httpErrors(401, '__AUTH__ incorrect username or password');
      }
      return this;
    });
};

userSchema.methods.createToken = function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(user => {
      return jsonWebToken.sign({
        tokenSeed: user.tokenSeed,
      }, process.env.SECRET_SALT);
    });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = (username, email, password) => {
  const HASH_SALT_ROUNDS = 8;
  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then(passwordHash => {
      const tokenSeed = crypto.randomBytes(64).toString('hex');
      return new User({
        username,
        email,
        passwordHash,
        tokenSeed,
        neuralNetworks: new neuralNetwork({}),
      }).save();
    });
};
