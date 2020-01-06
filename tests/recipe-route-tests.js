var request = require('supertest');

describe('Recipe route tests', function () {
	var server;
	
	before(function () {
		server = require('../app').listen(3002);
	});

	after(function () {
		server.close();
	});

	it('/recipes should give 200', function test(done) {
		request(server)
			.get('/recipes')
			.expect(200, done);
	});

	it('/recipes/add with JSON payload should give 200', function test(done) {
		request(server)
			.post('/recipes/add')
			.send({
					"name": "New",
					"ingredients" : [
						{
							"name": "pepper",
							"type": "vegetable"
						},
						{
							"name": "ads",
							"type": "vegetable"
						}
					]
				})
			.expect(200, done);
	});

	it('/recipes/add should give 502', function test(done) {
		request(server)
			.post('/recipes/add')
			.expect(502, done);
	});

	it('/recipes/delete?name=invalid should give 404', function test(done) {
		request(server)
			.get('/recipes/delete?name=invalid')
			.expect(404, done);
	});

	it('/recipes/delete?name=New should give 200', function test(done) {
		request(server)
			.get('/recipes/delete?name=New')
			.expect(200, done);
	});
});