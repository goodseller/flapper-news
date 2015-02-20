var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); };

      res.json(comment);
    });
  });
});

router.delete('/posts/:post', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
		if (err) { return next(err); };
		var comments = post.comments;

		for (var i = comments.length - 1; i >= 0; i--) {
			console.log('Number of comments: ' + i);
			comments[i].remove(function (err) {
				if (err) { return next(err); };
			});
		}
		
		post.remove(function (err) {
			if (err) { return next(err); };
			res.send('');
		});
	});
});

router.delete('/comments/:comment', function(req, res, next) {
	var comment = req.comment;
	return comment.remove(function (err) {
		if (err) { return next(err); };
		res.send('');
	});
});

router.put('/posts/:post/downvote', function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('comment', function(req, res, next, comment_id) {
  var query = Comment.findById(comment_id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
