const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostController = require('../controllers/posts')

const router = express.Router();



router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.post("", checkAuth, extractFile, PostController.addPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
