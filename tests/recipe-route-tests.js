const request = require('supertest');
const assert = require('assert');

describe('/recipe tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/recipes should give 200', (done) => {
        request(server)
            .get('/recipes')
            .expect(200, done);
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

    it('/recipes/add with JSON payload should give 200', (done) => {
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
            })
            .expect(200)
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
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}]} Got: {"name":"Missing","ingredients":[{"name":"pepper"},{"name":"chicken"}]}');
                return done();
            });
    });

    it('/recipes/add with JSON payload of existing recipe should give 502', (done) => {
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
            })
            .expect(502)
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
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'Recipe could not be added, missing data from JSON body. Expected: {"name":"<recipe name>","ingredients":[{"name":"<name>","category":"<category>","amount":"<amount>","weight":"<weight>"}]} Got: {}');
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

    it('/recipes/delete should give 404', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'invalid',
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
