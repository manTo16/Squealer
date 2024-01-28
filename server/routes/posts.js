const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  getPosts,
  createPost,
  getFeedIds,
  getPost,
  updateImpressions,
  getPostMentions,
  addReply,
  getReplies,
  getReceivers,
  searchPostByText,
  searchPostByUsername,
  searchPostByKeyword,
  addPostToChannel
} = require ('../controllers/postController.js')

router.route('/').post(verifyToken, createPost).get(getFeedIds)
router.route('/feed/:pageNumber').get(getFeedIds)

router.route('/test').get(getPosts)

router.route('/:id').get(getPost).put(addPostToChannel)
//router.route('/:username/posts').get(getUserPosts)
router.route('/:id/impressions/:impression').patch(updateImpressions)
router.route('/:id/mentions').get(getPostMentions)
router.route('/:id/replies').put(addReply).get(getReplies)
router.route('/:id/replies/:pageNumber').get(getReplies)
router.route('/:id/receivers').get(getReceivers)

router.route('/search/byText/:query').get(searchPostByText)
router.route('/search/byUsername/:query').get(searchPostByUsername)
router.route('/search/byKeyword/:query').get(searchPostByKeyword)

router.route('/search/byText/:query/:pageNumber').get(searchPostByText)
router.route('/search/byUsername/:query/:pageNumber').get(searchPostByUsername)
router.route('/search/byKeyword/:query/:pageNumber').get(searchPostByKeyword)

module.exports = router
