const request = require('supertest');

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
            .expect(200, done);
    });

    it('/recipes/add with JSON payload that has missing parameters in the ingredients should give 502', (done) => {
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
            .expect(502, done);
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
            .expect(502, done);
    });

    it('/recipes/add should give 502', (done) => {
        request(server)
            .post('/recipes/add')
            .expect(502, done);
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
            .expect(404, done);
    });

    it('/recipes/delete should give 200', (done) => {
        request(server)
            .delete('/recipes/delete')
            .send({
                name: 'New',
            })
            .expect(200, done);
    });
});
