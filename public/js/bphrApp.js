var app = angular.module('bphrApp', ['ui.router', 'ui.bootstrap']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'recordsController',
				resolve: {
					records: ['records', function(records) {
						return records.getAll();
					}]
				}
			});
		/*
		.state('posts', {
		  url: '/posts/{id}',
		  templateUrl: '/wall/posts.html',
		  controller: 'PostsCtrl',
		  resolve: {
			post: ['$stateParams', 'posts', function($stateParams, posts) {
			  return posts.get($stateParams.id);
			}]
		  }
		});
		*/

		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('chartController', function($scope, records) {
	$scope.records = records.records;
	var init = false;

	$scope.$watch('records', function(val, oval) {
		console.log('val', val, 'oval', oval);

		if (val !== 'undefined' && (val !== oval || init === false)) {
			if (!init) init = true;

			var dataset1 = [],
				dataset2 = [],
				dataset3 = [];

			for (var row in val) {
				var obj = val[row];
				var row1 = {
						'date': obj.date,
						'close': obj.lower_bp
					},
					row2 = {
						'date': obj.date,
						'close': obj.pulse
					},
					row3 = {
						'date': obj.date,
						'close': obj.upper_bp
					};

				dataset1.push(row1);
				dataset2.push(row2);
				dataset3.push(row3);

			}
			console.log(dataset1, dataset2, dataset3);

			dataset1 = [{
				close: 99,
				date: "2015-02-23T12:49:01.510Z"
			}, {
				close: 150,
				date: "2015-02-23T15:10:36.937Z"
			}];

			// var dataset = [{
			// 	'date': '2012-03-26T07:00:00.000Z',
			// 	'close': 10.0
			// }, {
			// 	'date': '2012-03-26T08:00:00.000Z',
			// 	'close': 11.0
			// }, {
			// 	'date': '2012-03-27T07:00:00.000Z',
			// 	'close': 12.0
			// }, {
			// 	'date': '2012-03-27T08:00:00.000Z',
			// 	'close': 11.0
			// }, {
			// 	'date': '2012-03-27T09:00:00.000Z',
			// 	'close': 9.0
			// }, {
			// 	'date': '2012-03-28T07:00:00.000Z',
			// 	'close': 7.98
			// }];

			var config = {
				margin: {
					top: 30,
					right: 200,
					bottom: 30,
					left: 50
				},
				ticks: 10,
				targetElem: ".line-chart",
				width: 800,
				height: 240
			};
			config.dateset = dataset1;
			var chart1 = new LineChart(config);

			// config.dateset = dataset2;
			// var chart2 = new LineChart(config);
			//
			// config.dateset = dataset3;
			// var chart3 = new LineChart(config);
		}
	});
});


app.factory('record', [function() {
	return {};
}]);


app.factory('records', ['$http', 'record', function($http) {
	var o = {};
	o.records = [];

	o.getAll = function() {
		return $http.get('/bphr/records').success(function(data) {
			angular.copy(data, o.records);
		});
	};

	return o;
}]);

app.controller('recordsController', [
	'$scope',
	'records',
	'record',
	function($scope, records, record) {
		$scope.records = records.records;

	}
]);
