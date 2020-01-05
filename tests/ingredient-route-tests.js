var request = require('supertest');

describe('Ingredient route tests', function () {
	var server;
	
	before(function () {
		server = require('../app').listen(3002);
	});

	after(function () {
		server.close();
	});

	it('Should give 200 listing ingredients', function test(done) {
		request(server)
			.get('/ingredients')
			.expect(200, done);
	});

	it('Should give 200 adding an ingredient', function test(done) {
		request(server)
			.get('/ingredients/add?ingredient=banana')
			.expect(200, done);
	});

	it('Should give 502 adding an ingredient with no parameter', function test(done) {
		request(server)
			.get('/ingredients/add')
			.expect(502, done);
	});

	it('Should give 404 trying to delete an ingredient that does not exist', function test(done) {
		request(server)
			.get('/ingredients/delete?ingredient=invalid')
			.expect(404, done);
	});


	it('Should give 200 when deleting ingredient', function test(done) {
		request(server)
			.get('/ingredients/delete?ingredient=banana')
			.expect(200, done);
	});
});