const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const httpErrors = require('http-errors');
const logger = require('../lib/logger');

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
        neuralNetworks: [],
      }).save();
    });
};

User.handleGoogleAuth = googlePlusProfile => { //nicholas TODO: refactor user to have all three specific oauths

  logger.log('info', 'user.handleGoogleAuth');
  return User.findOne({email: googlePlusProfile.email})
    .then(account => {
      if(account){
        if(account.OAuth)
          return account; //TODO: remove- nicholas- this is being hit propperly
        logger.log('info', 'error- an account was found but not connected to google');
        throw new Error('An account was found ,but it was not connected to Google');
      }

      logger.log('info','creating new account with oauth');

      return new User({
        username: googlePlusProfile.email.split('@')[0],
        email: googlePlusProfile.email,
        passwordHash: crypto.randomBytes(64).toString('hex'),
        tokenSeed: crypto.randomBytes(64).toString('hex'),
        OAuth: true,
      }).save();
    })
    .catch(error => {
      console.log(error);
      logger.log('info', error);
      next();
    });
};
