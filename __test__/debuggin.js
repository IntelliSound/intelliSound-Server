describe(`testing`, () => {
  test(`braces don't line up`, () => {
    let tempUserMock = {};
    return userMockFactory.create()
      .then(response => {
        tempUserMock.user = response.user;
        tempUserMock.token = response.token;
        return neuralNetworkMockFactory.create()
          .then(response => {
            tempUserMock.user = response.user;
          })
      })
  })
})

describe(`neural network PUT request`, () => {
  test(`neural network PUT request should return a 200 status and the updated network if there are no errors`, () => {
    let tempUserMock = {};
    return userMockFactory.create()
      .then(response => {
        tempUserMock.user = response.user;
        tempUserMock.token = response.token;
        return neuralNetworkMockFactory.create()
          .then(response => {
            tempUserMock.user = response.user;
            return superagent.put(`${API_URL}/network/${tempUserMock.user.neuralNetwork._id}`)
            .set('Authorization', `Bearer ${tempUserMock.token}`)
            .send({neuralNetwork: placeholderNetwork});
          })
    })
    .then(response => {
      expect(response.status).toEqual(200);
    });
  });
}
