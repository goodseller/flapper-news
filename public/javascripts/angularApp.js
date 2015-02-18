var app = angular.module('flapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
//    .state('home', {
//      url: '/home',
//      templateUrl: '/home.html',
//      controller: 'MainCtrl'
//    })
//	.state('posts', {
//	  url: '/posts/{id}',
//	  templateUrl: '/posts.html',
//	  controller: 'PostsCtrl'
//	});
	.state('home', {
	  url: '/home',
	  templateUrl: '/home.html',
	  controller: 'MainCtrl',
	  resolve: {
		postPromise: ['posts', function(posts){
		  return posts.getAll();
		}]
	  }
	})
	.state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
		post: ['$stateParams', 'posts', function($stateParams, posts) {
		  return posts.get($stateParams.id);
		}]
	  }
	});



  $urlRouterProvider.otherwise('home');
}]);


app.factory('post',[function () {
	return {};
}]);


app.factory('posts', ['$http', 'post', function($http){
  var o = {
/*
    posts: [
		{title: 'post 1', upvotes: 1, 
		comments: [
			{author: 'Joe', body: 'Cool post!', upvotes: 0},
		]},
		{title: 'post 2', upvotes: 2, 
		comments: [
			{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
		]},
		{title: 'post 3', upvotes: 3, 
		comments: [
			{author: 'Joe', body: 'Cool post!', upvotes: 0},
			{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
		]},
		{title: 'post 4', upvotes: 4, 
		comments: [
			{author: 'Joe', body: 'Cool post!', upvotes: 0},
			{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
		]},
	]
*/
  };
  
  o.posts = [];
  
	o.getAll = function() {
		return $http.get('/posts').success(function(data){
		  angular.copy(data, o.posts);
		});
	};
  
	o.create = function(post) {
	  return $http.post('/posts', post).success(function(data){
		o.posts.push(data);
	  });
	};
  
	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote')
		.success(function(data){
		  post.upvotes += 1;
		});
	};
	
	o.downvote = function(post) {
	  return $http.put('/posts/' + post._id + '/downvote')
		.success(function(data){
		  post.upvotes -= 1;
		});
	};
  
  
	o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
		return res.data;
	  });
	};
  
	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
		.success(function(data){
		  comment.upvotes += 1;
		});
	};
	
	o.downvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote')
		.success(function(data){
		  comment.upvotes -= 1;
		});
	};
	
  return o;
}]);

app.controller('PostsCtrl', [
'$scope',
//'$stateParams',
'posts',
'post',
function($scope, posts, post){
//function($scope, $stateParams, posts, post){
	//$scope.post = posts.posts[$stateParams.id];
	$scope.post = post;

	$scope.addComment = function(){
	  if($scope.body === '') { return; };
	  posts.addComment(post._id, {
		body: $scope.body,
		author: 'user',
	  }).success(function(comment) {
		$scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};
	
	$scope.upvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};
	
	$scope.downvotes = function(comment){
	  posts.downvoteComment(post, comment);
	};
	
	/*
	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  $scope.post.comments.push({
		body: $scope.body,
		author: 'user',
		upvotes: 0
	  });
	  $scope.body = '';
	};
	*/
}]);


app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
	$scope.test = 'Hello world!';
	$scope.posts = posts.posts;
	$scope.upvotes = function(post) {
	  posts.upvote(post);
	};
	$scope.downvotes = function(post) {
	  posts.downvote(post);
	};

//$scope.incrementUpvotes = function(post) {
//  post.upvotes += 1;
//};

/*
$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
	$scope.posts.push({
	  title: $scope.title,
	  link: $scope.link,
	  upvotes: 0,
	  comments: [
		{author: 'Joe', body: 'Cool post!', upvotes: 0},
		{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
	  ]
	});

  $scope.title = '';
  $scope.link = '';
};
*/

$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  posts.create({
    title: $scope.title,
    link: $scope.link,
  });
  $scope.title = '';
  $scope.link = '';
};

}]);

