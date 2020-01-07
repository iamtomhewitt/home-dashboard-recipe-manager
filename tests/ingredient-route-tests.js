const request = require('supertest');

describe('Ingredient route tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/ingredients should give 200', (done) => {
        request(server)
            .get('/ingredients')
            .expect(200, done);
    });

    it('/ingredients/add should give 200', (done) => {
        request(server)
            .post('/ingredients/add')
            .send({
                name: 'pepper',
                type: 'vegetable',
            })
            .expect(200, done);
    });

    it('/ingredients/add should give 502 when sending existing ingredient', (done) => {
        request(server)
            .post('/ingredients/add')
            .send({
                name: 'pepper',
                type: 'vegetable',
            })
            .expect(502, done);
    });

    it('/ingredients/add should give 502', (done) => {
        request(server)
            .post('/ingredients/add')
            .expect(502, done);
    });

    it('/ingredients/delete should give 404', (done) => {
        request(server)
            .delete('/ingredients/delete')
            .send({
                name: 'invalid',
            })
            .expect(404, done);
    });


    it('/ingredients/delete should give 200', (done) => {
        request(server)
            .delete('/ingredients/delete')
            .send({
                name: 'pepper',
            })
            .expect(200, done);
    });
});
