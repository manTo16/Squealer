const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  getAllUsers,
  //addNewUser,
  getUserPosts,
  getUser,
  updateUser,
  deleteUser,
  getUserChannels,
  getUserImpressions,
  getUserImpressionsVeryLikes,
  getUserImpressionsLikes,
  getUserImpressionsDislikes,
  getUserImpressionsVeryDislikes,
  getUserImpressionsViews,
  return200
} = require ('../controllers/userController.js')


router.route('/').get(getAllUsers)/*.post(addNewUser)*/
router.route('/:userName/posts').get(getUserPosts)
router.route('/:userName').get(getUser).patch(updateUser).delete(deleteUser)
router.route('/:userName/channels').get(verifyToken,getUserChannels)

router.route('/:userName/impressions').get(getUserImpressions)
router.route('/:userName/impressions/veryLikes').get(getUserImpressionsVeryLikes)
router.route('/:userName/impressions/likes').get(getUserImpressionsLikes)
router.route('/:userName/impressions/dislikes').get(getUserImpressionsDislikes)
router.route('/:userName/impressions/veryDislikes').get(getUserImpressionsVeryDislikes)
router.route('/:userName/impressions/views').get(getUserImpressionsViews)
router.route('/:userName/impressions/none').get(return200)

module.exports = router
