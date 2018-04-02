# intelliSound-Server

[![Build Status](https://travis-ci.org/IntelliSound/intelliSound-Server.svg?)](https://travis-ci.org/ScrambleVox/server)
![Heroku](http://heroku-badge.herokuapp.com/?app=intellisound-server&style=flat&svg=1)

### _Train your very own neural net_

## Overview

The intelliSound API allows a client to create and train a simple predictive neural network. The network is based on a simple perceptron algorithm, which is a feed forward neural network. A neural network is trained on a simple audio waveform, and the neural network will learn to predict this pattern. When activated, it will take a random noise seed as default, and attempt to build its own version of the audio waveform it has been trained on, based on that seed input. There are additional optional query parameters which allow a user to choose a different seed input on which the neural network can use to build the output audio.
***
## Getting Started

A basic understanding of npm, git, aws S3, and ES6 is assumed. To build your own server, first fork/clone this repo and do an `npm i`. Set up an aws bucket, and create the relevant env variables in a .env file. In the .env, setup the PORT, MONGODB_URI, and SECRET_SALT variables with the values relevant to your deployment. The SECRET_SALT should be a long string of randomly generated characters, as this is used to sign the token seed during encryption. Also set in the .env file your relevant aws S3 keys, your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_BUCKET.
***
## Models

There is a neuralNetwork model as well as a user model, which are optional to use. The server may be queried without needing a token. If desired, a client can create a user account, which can persist trained neural networks. Using these routes, a user can specify one of their saved neural nets to train, as well as name them.

### User

The user model has username, email, and password as required properties on creation. The password is hashed with a secret salt and stored only in its hashed form. Upon creation, a tokenSeed is generated and saved, and each time a user logs back in, this tokenSeed is randomly re-generated. There is also a neuralNetwork property which is a link to the user's neural networks associated with their account. Last, there is an option to login using Google's OAuth, and the user model has a property which denotes whether OAuth was used in lieu of normal authentication.

### NeuralNetwork

The neural network model is relatively simple. It consists of a name property and a string which is the JSON representation of the saved neural network itself.
***
## Routes

There are three different main routes, the user route, the neural network route and the OAuth route.

### User

The user routes are a group of three different routes: '/signup', '/login', and '/user'. The signup route takes a post request with a body. The body must contain a username, an email and a password. The login and user routes both require an auth header, the login route will perform basic auth and the user route will require a token.

### NeuralNetwork

The neural network routes are all prefixed by '/neuralnetwork'. All four CRUD operations are available on the neural networks. 

Post requests are only available for logged-in users. There are two post routes, '/save/:neuralnetname', which will take a trained neural net and save it to a user's account, and '/:wavename/:neuralnetname', which will train a new neural network and save it to a user's account.

Get requests can be made to retrieve existing networks or to train new networks and return the output audio to the user via an AWS S3 link. The get on '/wave/:wavename' will train a new neural net on the parameter passed in as wavename. This route also takes an optional query, ?seed=seedwave. The default wave that the neural network will build the output wave on is noise, but with the seed query, one of the other waveforms can be used to build upon. The valid wavenames and seedwaves are: 'org', 'saw', 'sin', 'sqr' and 'tri'. The get on '/:networkID' will return the neural network associated with that ID. This route requires bearer auth.

Put requests can be made on the route '/:networkID/:wavename' will get the network at the ID given and train it on the wavename. It will return the link to AWS resource where the output is saved. Bearer auth is required.

Delete requests can be made on the route '/:networkID'. It will delete the network at that ID. Bearer auth is required.

### OAuth

There is one get route at '/oauth/google' which takes a code as a query. This route will handle the OAuth interactions with Google, and if successful, allows a user to obtain an account and receive a token as an alternative to signing in via the user routes.
***
## Code Examples

```javascript
superagent.post(`${API_URL}/signup`)
  .send({
    username: 'therealcameron',
    email: 'cameron@therealcameron.com',
    password: 'supersecretpassword',
  })

superagent.get(`${API_URL}/login`)
  .auth(request.username, request.password);

superagent.get(`${API_URL}/user`)
  .set('Authorization', `Bearer ${token}`);

superagent.get(`${API_URL}/neuralnetwork/wave/saw?seed=sin`);
```
***
## Technologies Used

### Production
* Synaptic JS
* ES6
* node
* bcrypt
* dotenv
* express
* fs-extra
* http-errors
* jsonwebtoken
* mongodb
* mongoose

### Development
* eslint
* faker
* jest
* superagent
* winston
***
## To Contribute
If you would like to help improve this API you can do so by opening an issue under the 'Issues' tab on the repo. We welcome any helpful feedback! Be sure to include a label to help us better understand the issue (i.e. 'bug' to report a problem).
***
## License
MIT (see License file)
***
## Authors
- Andrew L. Bloom | [GitHub](https://github.com/ALB37)
- Shannon E. Dillon | [GitHub](https://github.com/sedillon93)
- Jacob M-G Evans | [GitHub](https://github.com/cloud887)
- David A. Lindahl | [GitHub](https://github.com/austriker27)
- Nicholas M. Carignan | [GitHub](https://github.com/ncarignan)
***
## Special Thanks
Thank you to Vinicio Vladimir Sanchez Trejo, Steve Geluso, Izzy Baer, Joshua Evans, and Ron Dunphy for help problem solving and identifying useful tools.
