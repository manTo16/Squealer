const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createPost,
  getFeedIds,
  getPost,
  getUserPosts
} = require ('../controllers/postController.js')

router.route('/').post(verifyToken, createPost).get(getFeedIds)
router.route('/:id').get(getPost)
//router.route('/:username/posts').get(getUserPosts)

module.exports = router
