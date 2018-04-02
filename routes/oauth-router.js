'use strict';

const {Router} = require('express');
const User = require('../models/user');
const superagent = require('superagent');

const logger = require('../lib/logger');

const oauthRouter = module.exports = new Router();

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

oauthRouter.get('/oauth/google',(request,response,next) => { //eslint-disable-line
  if(!request.query.code){
    response.redirect(process.env.CLIENT_URL);
  } else {
    logger.log('info', `code : ${request.query.code}`);
    return superagent.post(GOOGLE_OAUTH_URL)
      .type('form')
      .send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_CLIENT_ID, //TODO: nicholas - set up id and secret in heroku
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/oauth/google`,
      })
      .then(response => {
        logger.log('info','redirected back from google oauth');
        if(!response.body.access_token)
          throw new Error('no access token');

        return response.body.access_token;
      })
      .then(accessToken => {
        logger.log('info','sending get to openid');
        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then(response => {
        logger.log('info','redirected back from open id');
        logger.log('info',`profile: ${response.body}`);
        return User.handleGoogleAuth(response.body);
      })
      .then(user => {
        return user.createToken();
      })
      .then(token => {
        response.cookie('X-intelliSoundAi-Token',token);
        response.redirect(process.env.CLIENT_URL);
      })
      .catch(error => {
        logger.log('info',error);
        response.cookie('X-intelliSoundAi-Token','');
        response.redirect(process.env.CLIENT_URL + '?error=oauth');
      });
  }
});
