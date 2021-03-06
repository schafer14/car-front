'use strict';

// Cars controller
angular.module('cars').controller('CarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cars',
	function($scope, $stateParams, $location, Authentication, Cars ) {
		$scope.authentication = Authentication;
		$scope.grid = { 
			data: 'cars',
			columnDefs: [
				{field: 'name', displayName: 'Name'},
				{field: 'urgent', displayName: 'Urgent'},
				{field: 'price', displayName: 'Price'},
				{field: 'created', displayName: 'Discovered At'},
				{field: 'make', displayName: 'Make'},
				{field: 'model', displayName: 'Model'},
				{field: 'year', displayName: 'Year'},
				{field: 'registered', displayName: 'Rego'},
				{field: 'kms', displayName: 'Kilometeres'},
				{field: 'body', displayName: 'Body'},
			],
			showGroupPanel: true,
			jqueryUIDraggable: true,
		};

		// Create new Car
		$scope.create = function() {
			// Create new Car object
			var car = new Cars ({
				name: this.name
			});

			// Redirect after save
			car.$save(function(response) {
				$location.path('cars/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Car
		$scope.remove = function( car ) {
			if ( car ) { car.$remove();

				for (var i in $scope.cars ) {
					if ($scope.cars [i] === car ) {
						$scope.cars.splice(i, 1);
					}
				}
			} else {
				$scope.car.$remove(function() {
					$location.path('cars');
				});
			}
		};

		// Update existing Car
		$scope.update = function() {
			var car = $scope.car ;

			car.$update(function() {
				$location.path('cars/' + car._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cars
		$scope.find = function() {
			$scope.cars = Cars.query();
		};

		// Find existing Car
		$scope.findOne = function() {
			$scope.car = Cars.get({ 
				carId: $stateParams.carId
			});
		};
	}
]);