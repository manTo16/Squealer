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
  return200,
  getUserImage,
  searchUserByDisplayName,
  searchUserByUsername,
  searchUserByDisplayNameOneResult,
  searchUserByUsernameOneResult,
  setUserCharacters,
  updateUserCharacters,
  getUserDebt
} = require ('../controllers/userController.js')


router.route('/').get(getAllUsers)/*.post(addNewUser)*/
router.route('/:userName/posts').get(getUserPosts)
router.route('/:userName').get(getUser).patch(updateUser).delete(deleteUser)
router.route('/:userName/channels').get(verifyToken,getUserChannels)
router.route('/:userName/propic').get(getUserImage)

router.route('/:userName/impressions').get(getUserImpressions)
router.route('/:userName/impressions/veryLikes').get(getUserImpressionsVeryLikes)
router.route('/:userName/impressions/likes').get(getUserImpressionsLikes)
router.route('/:userName/impressions/dislikes').get(getUserImpressionsDislikes)
router.route('/:userName/impressions/veryDislikes').get(getUserImpressionsVeryDislikes)
router.route('/:userName/impressions/views').get(getUserImpressionsViews)
router.route('/:userName/impressions/none').get(return200)

router.route('/search/byDisplayName/:name').get(searchUserByDisplayName)
router.route('/search/byUsername/:name').get(searchUserByUsername)
router.route('/search/byDisplayName/oneResult/:name').get(searchUserByDisplayNameOneResult)
router.route('/search/byUsername/oneResult/:name').get(searchUserByUsernameOneResult)

router.route('/:userName/characters/').put(setUserCharacters).patch(updateUserCharacters)
router.route('/:userName/debt').get(getUserDebt)

module.exports = router
