const request = require('supertest');

describe('/planner tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/planner should give 200', (done) => {
        request(server)
            .get('/planner')
            .expect(200, done);
    });

    it('/planner?day=Monday should give 200', (done) => {
        request(server)
            .get('/planner?day=Monday')
            .expect(200, done);
    });

    it('/planner?day=invalid should give 502', (done) => {
        request(server)
            .get('/planner?day=invalid')
            .expect(502, done);
    });
});

describe('/planner/add tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/planner/add with JSON payload should give 200', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'Monday',
                recipe: 'Some recipe',
            })
            .expect(200, done);
    });

    it('/planner/add should give 502', (done) => {
        request(server)
            .post('/planner/add')
            .expect(502, done);
    });

    it('/planner/add with JSON payload and incorrect day should give 502', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'MadeupDay',
                recipe: 'Some recipe',
            })
            .expect(502, done);
    });
});
