'use strict';

const {Router} = require('express');
const User = require('../models/user');
const superagent = require('superagent');

const logger = require('../lib/logger');

const oauthRouter = module.exports = new Router();

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
const GOOGLE_CLIENT_ID_JSON = {'web':{'client_id':'1009680303973-ctmukkrculf9p3e4i3gr4e54558tjfbr.apps.googleusercontent.com','project_id':'intellisoundai','auth_uri':'https://accounts.google.com/o/oauth2/auth','token_uri':'https://accounts.google.com/o/oauth2/token','auth_provider_x509_cert_url':'https://www.googleapis.com/oauth2/v1/certs','client_secret':'tzzD6iWBaxTmGGupU0Qhc-MB','redirect_uris':['https://intellisoundai.com/login'],'javascript_origins':['https://intellisoundai.com']}};

oauthRouter.get('/oauth/google',(request,response,next) => {
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
      .then(user => user.createToken())
      .then(token => {
        response.cookie('X-intelliSoundAi-Token',token);
        response.redirect(process.env.CLIENT_URL);
      })
      .catch(error => {
        logger.log('info',{error});
        response.cookie('X-intelliSoundAi-Token','');
        response.redirect(process.env.CLIENT_URL + '?error=oauth');
      });
  }
});
