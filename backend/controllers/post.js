const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    name: req.body.name,
    post: req.body.post,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  try {
    const result = await post.save();
    return res.status(201).json({
      message: 'post added successfully',
      post: {
        ...result,
        id: result._id
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'failed',
      error
    });
  }
  // post.save((err, result) => {
  //   if (err) {

  //   }
  //   return res.status(201).json({
  //     message: 'post added successfully',
  //     post: {
  //       ...result,
  //       id: result._id
  //     }
  //   });
  // });
};

exports.readOnePost = async (req, res, next) => {
  const result = await Post.findById(req.params.id);
  if (!result)
    return res.status(500).json({
      message: ' not found '
    });
  return res.status(200).json(result);
};

exports.updatePost = (req, res, next) => {
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
    console.log(result);
    if (result.n <= 0) {
      return res.status(401).json({
        message: 'update failed unauthorized'
      });
    }
    return res.status(200).json({
      message: 'update successfully'
    });
  });
};

exports.readPost = (req, res, next) => {
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
};

exports.deletePost = (req, res, next) => {
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
};
