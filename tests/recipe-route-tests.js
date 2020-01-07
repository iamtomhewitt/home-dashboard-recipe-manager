const request = require('supertest');

describe('Recipe route tests', () => {
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

    it('/recipes/add with JSON payload should give 200', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                name: 'New',
                ingredients: [
                    {
                        name: 'pepper',
                        type: 'vegetable',
                    },
                    {
                        name: 'ads',
                        type: 'vegetable',
                    },
                ],
            })
            .expect(200, done);
    });

    it('/recipes/add with JSON payload of existing recipe should give 502', (done) => {
        request(server)
            .post('/recipes/add')
            .send({
                name: 'New',
                ingredients: [
                    {
                        name: 'pepper',
                        type: 'vegetable',
                    },
                    {
                        name: 'ads',
                        type: 'vegetable',
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
