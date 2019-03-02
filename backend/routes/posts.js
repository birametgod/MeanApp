const express = require('express');
const router = express.Router();
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');
const validateObjectId = require('../middleware/validateObjectId');
const postController = require('../controllers/post');

router.post('', checkAuth, extractFile, postController.createPost);

router.get('/:id', validateObjectId, postController.readOnePost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.get('', postController.readPost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
