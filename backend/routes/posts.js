const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    name: req.body.name,
    post: req.body.post,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'failed',
        error: err
      });
    }
    return res.status(201).json({
      message: 'post added successfully',
      post: {
        ...result,
        id: result._id
      }
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({
        message: ' not found '
      });
    }
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({
        message: ' not found '
      });
    }
  });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    name: req.body.name,
    post: req.body.post,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post, (err, result) => {
    if (err) {
      return res.status(404).json({
        error: err
      });
    }
    if (result.nModified <= 0) {
      return res.status(401).json({
        message: 'update failed'
      });
    }
    return res.status(200).json({
      message: 'update successfully'
    });
  });
});

router.get('', (req, res, next) => {
  const currentPage = +req.query.page;
  const size = +req.query.size;
  const postQuery = Post.find();
  let fetchedPosts;
  if (currentPage && size) {
    postQuery.skip(size * (currentPage - 1)).limit(size);
  }
  postQuery
    .find()
    .then(docs => {
      fetchedPosts = docs;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'successful',
        post: fetchedPosts,
        maxPost: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'failed',
        err: err
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'delete failed',
        err: err
      });
    }
    if (result.n <= 0) {
      return res.status(401).json({
        message: 'delete failed , not Authorized'
      });
    }
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = router;
