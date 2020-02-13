const request = require('supertest');
const assert = require('assert');
require('dotenv').config();

describe('/recipe tests', () => {
    let server;

    before((done) => {
        server = require('../app').listen(3002);
        setTimeout(() => {
            done();
        }, 500);
    });

    after(() => {
        server.close();
    });

    it('/recipes should give 200', (done) => {
        request(server)
            .get(`/recipes?apiKey=${process.env.API_KEY}`)
            .expect(200, done);
    });

    it('/recipes should give 400 when no api key specified', (done) => {
        request(server)
            .get('/recipes')
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'No API key specified');
                return done();
            });
    });

    it('/recipes should give 401 when api key is incorrect', (done) => {
        request(server)
            .get('/recipes?apiKey=incorrect')
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'API key is incorrect');
                return done();
            });
    });
});

describe('/recipes/add tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/recipes/add with JSON payload should give 201', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                name: 'New',
                ingredients: [
                    {
                        name: 'pepper',
                        category: 'vegetable',
                        amount: 100,
                        weight: 'grams',
                    },
                    {
                        name: 'chicken',
                        category: 'meat',
                        amount: 300,
                        weight: 'grams',
                    },
                ],
                apiKey: process.env.API_KEY,
            })
            .expect(201)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Recipe 'New' added");
                return done();
            });
    });

    it('/recipes/add with JSON payload that has missing parameters in the ingredients should give 400', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                name: 'Missing',
                ingredients: [
                    {
                        name: 'pepper',
                    },
                    {
                        name: 'chicken',
                    },
                ],
                apiKey: process.env.API_KEY,
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, `Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}]} Got: {"name":"Missing","ingredients":[{"name":"pepper"},{"name":"chicken"}],"apiKey":"${process.env.API_KEY}"}`);
                return done();
            });
    });

    it('/recipes/add with JSON payload of existing recipe should give 500', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                name: 'New',
                ingredients: [
                    {
                        name: 'pepper',
                        category: 'vegetable',
                        amount: 100,
                        weight: 'grams',
                    },
                    {
                        name: 'chicken',
                        category: 'meat',
                        amount: 300,
                        weight: 'grams',
                    },
                ],
                apiKey: process.env.API_KEY,
            })
            .expect(500)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Cannot add recipe: 'New' already exists");
                return done();
            });
    });

    it('/recipes/add should give 400', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                apiKey: process.env.API_KEY,
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, `Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}]} Got: {"apiKey":"${process.env.API_KEY}"}`);
                return done();
            });
    });

    it('/recipes/add should give 401 if api key is incorrect', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                apiKey: 'incorrect',
            })
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'API key is incorrect');
                return done();
            });
    });

    it('/recipes/add should give 400 if api key is not specified', (done) => {
        request(server)
            .post('/recipes/add')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'No API key specified');
                return done();
            });
    });
});

describe('/recipes/update tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/recipes/update should give 201 if recipe does not exist', (done) => {
        request(server)
            .put('/recipes/update')
            .send({
                originalName: 'test',
                ingredients: [
                    {
                        name: '1',
                        category: '2',
                        amount: '3',
                        weight: '4',
                    },
                ],
                apiKey: process.env.API_KEY,
            })
            .expect(201)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "'test' could not be updated as it does not exist, so it was created instead");
                return done();
            });
    });

    it('/recipes/update should give 200 when updating existing recipe', (done) => {
        request(server)
            .put('/recipes/update')
            .send({
                originalName: 'test',
                newName: 'testNew',
                ingredients: [
                    {
                        name: '1',
                        category: '2',
                        amount: '3',
                        weight: '4',
                    },
                ],
                apiKey: process.env.API_KEY,
            })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "'testNew' successfully updated");
                return done();
            });
    });

    it('/recipes/update should give 400 if api key is not specified', (done) => {
        request(server)
            .put('/recipes/update')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'No API key specified');
                return done();
            });
    });

    it('/recipes/update should give 401 if api key is incorrect', (done) => {
        request(server)
            .put('/recipes/update')
            .send({
                apiKey: 'incorrect',
            })
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'API key is incorrect');
                return done();
            });
    });

    it('/recipes/update should give 400 if payload is incorrect', (done) => {
        request(server)
            .put('/recipes/update')
            .send({
                apiKey: process.env.API_KEY,
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, `Recipe could not be updated, missing data from JSON body. Expected: {"originalName":"<recipe name>","newName":"<recipe name>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}]} Got: {"apiKey":"${process.env.API_KEY}"} ('newName' is an optional parameter)`);
                return done();
            });
    });
});

describe('/recipe/delete tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/recipes/delete should give 400 if no API key specified', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'invalid',
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'No API key specified');
                return done();
            });
    });

    it('/recipes/delete should give 401 if API key incorrect', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'invalid',
                apiKey: 'incorrect',
            })
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'API key is incorrect');
                return done();
            });
    });

    it('/recipes/delete should give 404', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'invalid',
                apiKey: process.env.API_KEY,
            })
            .expect(404)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Cannot delete recipe: 'invalid' not found");
                return done();
            });
    });

    it('/recipes/delete should give 200', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'New',
                apiKey: process.env.API_KEY,
            })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "'New' successfully deleted");
                return done();
            });
    });
});
