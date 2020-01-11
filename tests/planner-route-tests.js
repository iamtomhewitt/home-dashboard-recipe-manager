const request = require('supertest');
const assert = require('assert');

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
            .get('/planner?day=Monday')
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

    it('/planner?day=invalid should give 502', (done) => {
        request(server)
            .get('/planner?day=invalid')
            .expect(502)
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

    it('/planner/add with JSON payload should give 200', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'Monday',
                recipe: 'Some recipe',
            })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Recipe 'Some recipe' added");
                return done();
            });
    });

    it('/planner/add should give 502', (done) => {
        request(server)
            .post('/planner/add')
            .expect(502)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, 'Planner could not be updated, missing data from JSON body. Expected: {"day":"<day>","recipe":"<recipe>"} Got: {}');
                return done();
            });
    });

    it('/planner/add with JSON payload and incorrect day should give 502', (done) => {
        request(server)
            .post('/planner/add')
            .send({
                day: 'MadeupDay',
                recipe: 'Some recipe',
            })
            .expect(502)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.message, "Planner could not be updated: 'MadeupDay' not a valid day");
                return done();
            });
    });
});
