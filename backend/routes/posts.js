const express = require('express');
const router = express.Router();
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const checkAuth = require('../middleware/check-auth');
const validateObjectId = require('../middleware/validateObjectId');
const postController = require('../controllers/post');

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

router.post('', checkAuth, multer({ storage: storage }).single('image'), postController.createPost);

router.get('/:id', validateObjectId, postController.readOnePost);

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), postController.updatePost);

router.get('', postController.readPost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
