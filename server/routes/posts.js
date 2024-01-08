const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createPost,
  getFeedIds,
  getPost,
  updateImpressions,
  getPostMentions,
  addReply,
  getReplies
} = require ('../controllers/postController.js')

router.route('/').post(verifyToken, createPost).get(getFeedIds)
router.route('/:id').get(getPost)
//router.route('/:username/posts').get(getUserPosts)
router.route('/:id/impressions/:impression').patch(updateImpressions)
router.route('/:id/mentions').get(getPostMentions)
router.route('/:id/replies').put(addReply).get(getReplies)
module.exports = router
