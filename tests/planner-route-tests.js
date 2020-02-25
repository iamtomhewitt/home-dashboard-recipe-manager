const request = require('supertest');
const assert = require('assert');

describe('/planner tests', () => {
    let server;

    before((done) => {
        server = require('../app').listen(3002);
        setTimeout(() => {
            done();
        }, 1000);
    });

    after(() => {
        server.close();
    });

    it('/planner should give 200', (done) => {
        request(server)
            .get(`/planner?apiKey=${process.env.API_KEY}&plannerId=test-planner`)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.notEqual(response.body.planner, undefined);

                return done();
            });
    });

    it('/planner?day=Monday should give 200', (done) => {
        request(server)
            .get(`/planner?day=Monday&apiKey=${process.env.API_KEY}&plannerId=test-planner`)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.planner.day, 'Monday');
                assert.equal(response.body.message, 'Success');
                return done();
            });
    });

    it('/planner?day=invalid should give 401 if api key is incorrect', (done) => {
        request(server)
            .get('/planner?day=invalid&apiKey=incorrect&plannerId=test-planner')
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'API key is incorrect');
                return done();
            });
    });

    it('/planner?day=invalid should give 400 if api key is not specified', (done) => {
        request(server)
            .get('/planner?day=invalid')
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'No API key specified');
                return done();
            });
    });

    it('/planner?day=invalid should give 400', (done) => {
        request(server)
            .get(`/planner?day=invalid&apiKey=${process.env.API_KEY}&plannerId=test-planner`)
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'Could not get planner: \'invalid\' not a valid day');
                return done();
            });
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

    it('/planner/add with JSON payload should give 201', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'Monday',
                recipe: 'Some recipe',
                apiKey: process.env.API_KEY,
                plannerId: 'test-planner',
            })
            .expect(201)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Recipe 'Some recipe' added");
                return done();
            });
    });

    it('/planner/add with no JSON payload should give 400', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                apiKey: process.env.API_KEY,
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, `Planner could not be updated, missing data from JSON body. Expected: {"day":"<day>","recipe":"<recipe>","plannerId":"<plannerId>"} Got: {"apiKey":"${process.env.API_KEY}"}`);
                return done();
            });
    });

    it('/planner/add should give 400 if api key is not specified', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'Monday',
                recipe: 'Some recipe',
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

    it('/planner/add should give 401 if api key is incorrect', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'Monday',
                recipe: 'Some recipe',
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

    it('/planner/add with JSON payload and incorrect day should give 400', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'MadeupDay',
                recipe: 'Some recipe',
                apiKey: process.env.API_KEY,
                plannerId: 'test-planner',
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Planner could not be updated: 'MadeupDay' not a valid day");
                return done();
            });
    });
});
