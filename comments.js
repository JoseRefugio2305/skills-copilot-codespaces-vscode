//Create web server

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./model/comment');
var Post = require('./model/post');
var User = require('./model/user');
var jwt = require('jsonwebtoken');
var config = require('./config');

var port = process.env.PORT || 8080;

//connect to database
mongoose.connect(config.database);

//configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//set secret for token
app.set('superSecret', config.secret);

//create router
var router = express.Router();

//middleware for all request
router.use(function (req, res, next) {
    console.log('Request comming');
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Welcome to comment api'});
});

router.route('/comments')
    .post(function (req, res) {
        var comment = new Comment();
        comment.content = req.body.content;
        comment.postId = req.body.postId;
        comment.userId = req.body.userId;
        comment.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment created'});
        });
    })
    .get(function (req, res) {
        Comment.find(function (err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

router.route('/comments/:comment_id')
    .get(function (req, res) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })
    .put(function (req, res) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            }
            comment.content = req.body.content;
            comment.postId = req.body.postId;
            comment.userId = req.body.userId;
            comment.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Comment updated'});
            });
        });
    })
    .delete(function (req, res) {
        Comment.remove({
            _id: req.params.comment_id
        }, function (err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment deleted'});
        }
    );
}
);
