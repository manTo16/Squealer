const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createPost,
  getFeed,
  getPost,
  getUserPosts
} = require ('../controllers/postController.js')

router.route('/').post(verifyToken, createPost).get(getFeed)
router.route('/:id').get(getPost)
//router.route('/:username/posts').get(getUserPosts)

module.exports = router