const express = require('express');
const fetch = require('node-fetch');
const request = require('supertest');

const expressLoader = require('../loaders/express');
const firebaseMock = require('../mocks/firebase.json');

jest.mock('node-fetch');

describe('recipe', () => {
  let mockServer;

  beforeEach(async () => {
    const app = express();
    await expressLoader(app);

    mockServer = app.listen(process.env.PORT || 3002, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });

    fetch.mockResolvedValue({ json: () => firebaseMock });
  });

  afterEach(() => {
    mockServer.close();
  });

  it('should get recipes', async () => {
    const response = await request(mockServer).get('/api/recipes?id=12345');
    expect(response.body).toEqual(firebaseMock.cookbooks[0].recipes);
    expect(response.statusCode).toBe(200);
  });

  it('should return bad request when getting recipes with no id', async () => {
    const response = await request(mockServer).get('/api/recipes');
    expect(response.body.message).toEqual("'id' is missing from query parameter");
    expect(response.statusCode).toBe(400);
  });

  it('should create a recipe', async () => {
    const response = await request(mockServer)
      .post('/api/recipes?id=12345')
      .send(firebaseMock.cookbooks[0].recipes[0]);
    expect(response.body.message).toEqual('MOCK Bacon And Leek Risotto saved!');
    expect(response.statusCode).toBe(200);
  });

  it('should return bad request when creating a recipe with no id', async () => {
    const response = await request(mockServer)
      .post('/api/recipes')
      .send(firebaseMock.cookbooks[0].recipes[0]);
    expect(response.body.message).toEqual("'id' is missing from query parameter");
    expect(response.statusCode).toBe(400);
  });

  it('should return an error when trying to create a recipe', async () => {
    fetch.mockRejectedValue(new Error('test error'));
    const response = await request(mockServer)
      .post('/api/recipes?id=12345')
      .send(firebaseMock.cookbooks[0].recipes[0]);
    expect(response.body.message).toEqual('Could not save recipe: Error: test error');
    expect(response.statusCode).toBe(500);
  });

  it('should update a recipe', async () => {
    const response = await request(mockServer)
      .put('/api/recipes?id=12345')
      .send({
        ...firebaseMock.cookbooks[0].recipes[0],
        originalName: 'test recipe',
      });
    expect(response.body.message).toEqual('MOCK Bacon And Leek Risotto updated!');
    expect(response.statusCode).toBe(200);
  });

  it('should return bad request when updating a recipe with no id', async () => {
    const response = await request(mockServer)
      .put('/api/recipes')
      .send(firebaseMock.cookbooks[0].recipes[0]);
    expect(response.body.message).toEqual("'id' is missing from query parameter");
    expect(response.statusCode).toBe(400);
  });

  it('should return an error when trying to update a recipe', async () => {
    fetch.mockRejectedValue(new Error('test error'));
    const response = await request(mockServer)
      .put('/api/recipes?id=12345')
      .send({
        ...firebaseMock.cookbooks[0].recipes[0],
        originalName: 'test recipe',
      });
    expect(response.body.message).toEqual('Could not update recipe: Error: test error');
    expect(response.statusCode).toBe(500);
  });

  it('should delete a recipe', async () => {
    const response = await request(mockServer).delete('/api/recipes?name=recipe&id=12345');
    expect(response.body.message).toEqual('recipe deleted!');
    expect(response.statusCode).toBe(200);
  });

  it('should return bad request when deleting with no id', async () => {
    const response = await request(mockServer).delete('/api/recipes?name=recipe');
    expect(response.body.message).toEqual("'id' is missing from query parameter");
    expect(response.statusCode).toBe(400);
  });

  it('should return an error when trying to delete a recipe', async () => {
    fetch.mockRejectedValue(new Error('test error'));
    const response = await request(mockServer).delete('/api/recipes?name=recipe&id=12345');
    expect(response.body.message).toEqual('Could not delete recipe: Error: test error');
    expect(response.statusCode).toBe(500);
  });
});
