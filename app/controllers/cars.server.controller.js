'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Car = mongoose.model('Car'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Car already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Car
 */
exports.create = function(req, res) {
	var car = new Car(req.body);
	car.user = req.user;

	car.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * Show the current Car
 */
exports.read = function(req, res) {
	res.jsonp(req.car);
};

/**
 * Update a Car
 */
exports.update = function(req, res) {
	var car = req.car ;

	car = _.extend(car , req.body);

	car.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * Delete an Car
 */
exports.delete = function(req, res) {
	var car = req.car ;

	car.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * List of Cars
 */
exports.list = function(req, res) { Car.find().sort('-created').exec(function(err, cars) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(cars);
		}
	});
};

/**
 * Car middleware
 */
exports.carByID = function(req, res, next, id) { Car.findById(id).populate('user', 'displayName').exec(function(err, car) {
		if (err) return next(err);
		if (! car) return next(new Error('Failed to load Car ' + id));
		req.car = car ;
		next();
	});
};

/**
 * Car authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.car.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};