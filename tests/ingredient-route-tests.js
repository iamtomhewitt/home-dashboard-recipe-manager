var request = require('supertest');

describe('Ingredient route tests', function () {
	var server;
	
	before(function () {
		server = require('../app').listen(3002);
	});

	after(function () {
		server.close();
	});

	it('/ingredients should give 200', function test(done) {
		request(server)
			.get('/ingredients')
			.expect(200, done);
	});

	it('/ingredients/add?name=pepper&type=vegetable should give 200', function test(done) {
		request(server)
			.post('/ingredients/add')
			.send({
				"name": "pepper",
				"type": "vegetable"
			})
			.expect(200, done);
	});

	it('/ingredients/add should give 502', function test(done) {
		request(server)
			.post('/ingredients/add')
			.expect(502, done);
	});

	it('/ingredients/delete should give 404', function test(done) {
		request(server)
			.delete('/ingredients/delete')
			.send({
				"name": "invalid"
			})
			.expect(404, done);
	});


	it('/ingredients/delete should give 200', function test(done) {
		request(server)
			.delete('/ingredients/delete')
			.send({
				"name": "pepper"
			})
			.expect(200, done);
	});
});