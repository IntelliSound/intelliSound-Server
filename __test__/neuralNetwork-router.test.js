'use strict';
require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockFactory = require('./lib/mock-factories/user-mock-factory');
const neuralNetworkMockFactory = require('./lib/mock-factories/neuralNetwork-mock-factory');
const testNetwork = require('./lib/testNetwork');
const placeholderNetwork = JSON.stringify(testNetwork);

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`Neural Network Router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(neuralNetworkMockFactory.remove);
  afterEach(userMockFactory.remove);

  let triWaveToTest = 'tri';

  describe(`neural network POST request`, () => {
    test(`neural network POST request should return 200 and a network if there are no errors`, () => {
      let tempUserMock = {};
      return userMockFactory.create()
        .then(response => {
          tempUserMock.user = response.user;
          tempUserMock.token = response.token;
          // console.log(tempUserMock);
          return superagent.post(`${API_URL}/neuralnetwork/${triWaveToTest}/testname`)
            .set('Authorization', `Bearer ${tempUserMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.newNeuralNetwork).toBeTruthy();
          expect(response.body.neuralGeneratedFile).toBeTruthy();
        });
    }, 100000);
  });


  describe(`neural network GET/:id request`, () => {
    test(`neural network GET/:id request should return a 200 status specific network`, () => {
      let tempUserMock = {};
      return userMockFactory.create()
        .then(response => {
          tempUserMock.user = response.user;
          tempUserMock.token = response.token;
          return neuralNetworkMockFactory.create()
            .then(mock => {
              return superagent.get(`${API_URL}/neuralnetwork/${mock.networkID}`)
                .set('Authorization', `Bearer ${tempUserMock.token}`);
            })
            .then(res => {
              expect(res.status).toEqual(200);
            });
        });
    });
  });


  // describe(`neural network PUT/:neuralnetworkID/:wavename request`, () => {
  //   test(`neural network PUT request should return a 200 status if there are no errors`, () => {
  //     let tempUserMock = {};
  //     return userMockFactory.create()
  //       .then(response => {
  //         tempUserMock.user = response.user;
  //         tempUserMock.token = response.token;
  //         return neuralNetworkMockFactory.create()
  //           .then(response => {
  //             tempUserMock.user = response.user;
  //             tempUserMock.networkID = response.networkID;
  //             return superagent.put(`${API_URL}/neuralnetwork/${tempUserMock.networkID}/${triWaveToTest}`)
  //               .set('Authorization', `Bearer ${tempUserMock.token}`)
  //               .send({neuralNetwork: placeholderNetwork});
  //           });
  //       })
  //       .then(response => {
  //         expect(response.status).toEqual(200);
  //         expect(response.body.neuralNetwork).toBeTruthy();
  //         expect(response.body._id).toBeTruthy();
  //       });
  //   });

  // test(`neural network PUT request should return a 200 status if there are no errors`, () => {
  //   let tempUserMock = {};
  //   return userMockFactory.create()
  //     .then(response => {
  //       tempUserMock.user = response.user;
  //       tempUserMock.token = response.token;
  //       return neuralNetworkMockFactory.create()
  //         .then(response => {
  //           tempUserMock.user = response.user;
  //           tempUserMock.networkID = response.networkID;
  //           return superagent.put(`${API_URL}/neuralnetwork/${tempUserMock.networkID}`)
  //             .set('Authorization', `Bearer ${tempUserMock.token}`)
  //             .send({neuralNetwork: placeholderNetwork});
  //         });
  //     })
  //     .then(response => {
  //       expect(response.status).toEqual(200);
  //       expect(response.body.neuralNetwork).toBeTruthy();
  //       expect(response.body._id).toBeTruthy();
  //     });
  // });
  // });

//   describe(`neural network DELETE request`, () => {
//     test(`neural network DELETE request should return a 204 status if there are no errors`, () => {
//       let tempUserMock = {};
//       return userMockFactory.create()
//         .then(response => {
//           tempUserMock.user = response.user;
//           tempUserMock.token = response.token;
//           return neuralNetworkMockFactory.create()
//             .then(response => {
//               tempUserMock.user = response.user;
//               tempUserMock.networkID = response.networkID;
//               return superagent.delete(`${API_URL}/neuralnetwork/${tempUserMock.networkID}`)
//                 .set('Authorization', `Bearer ${tempUserMock.token}`);
//             });
//         })
//         .then(response => {
//           expect(response.status).toEqual(204);
//         });
//     });
//   });
});
