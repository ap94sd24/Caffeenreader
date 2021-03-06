const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostsController = require('../controllers/posts');


router.post("",
 checkAuth,
 extractFile, PostsController.createPost);

router.get("", PostsController.getPosts);

router.get("/search/:query", PostsController.getSearchResults);

router.get("/:id", PostsController.getOnePost);

router.delete("/:id", checkAuth, PostsController.deletePost);

router.put("/commentsNumberAndVotes/:id", PostsController.updateCommentsNumAndVotes);

router.put("/:id", checkAuth, extractFile, PostsController.editPost);

module.exports = router;
