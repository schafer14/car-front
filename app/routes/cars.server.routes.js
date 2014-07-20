'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cars = require('../../app/controllers/cars');

	// Cars Routes
	app.route('/cars')
		.get(cars.list)
		.post(users.requiresLogin, cars.create);

	app.route('/cars/:carId')
		.get(cars.read)
		.put(users.requiresLogin, cars.hasAuthorization, cars.update)
		.delete(users.requiresLogin, cars.hasAuthorization, cars.delete);

	// Finish by binding the Car middleware
	app.param('carId', cars.carByID);
};