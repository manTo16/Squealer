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
  getUserThumbnail,
  searchUserByDisplayNameALL,
  searchUserByUsernameALL,
  searchUserByDisplayNameOneResult,
  searchUserByUsernameOneResult,
  setUserCharacters,
  updateUserCharacters,
  getUserDebt,
  searchUserByUsernameNResults,
  searchUserByDisplayNameNResults,
  selectSMM,
  removeSMM,
  findUsers,
  getAllRepliesToUsers,
  deleteUserAccount,
  changePassword
} = require ('../controllers/userController.js')


router.route('/').get(getAllUsers)/*.post(addNewUser)*/
router.route('/:userName/posts').get(getUserPosts)
router.route('/:userName').get(getUser).patch(updateUser).delete(deleteUserAccount).put(updateUser)
router.route('/:userName/channels').get(verifyToken,getUserChannels)
router.route('/:userName/propic').get(getUserImage)
router.route('/:userName/propic-32').get(getUserThumbnail)

router.route('/:userName/impressions').get(getUserImpressions)
router.route('/:userName/impressions/veryLikes/').get(getUserImpressionsVeryLikes)
router.route('/:userName/impressions/veryLikes/:pageNumber').get(getUserImpressionsVeryLikes)
router.route('/:userName/impressions/likes/').get(getUserImpressionsLikes)
router.route('/:userName/impressions/likes/:pageNumber').get(getUserImpressionsLikes)
router.route('/:userName/impressions/dislikes/').get(getUserImpressionsDislikes)
router.route('/:userName/impressions/dislikes/:pageNumber').get(getUserImpressionsDislikes)
router.route('/:userName/impressions/veryDislikes/').get(getUserImpressionsVeryDislikes)
router.route('/:userName/impressions/veryDislikes/:pageNumber').get(getUserImpressionsVeryDislikes)
router.route('/:userName/impressions/views/').get(getUserImpressionsViews)
router.route('/:userName/impressions/views/:pageNumber').get(getUserImpressionsViews)
router.route('/:userName/impressions/none').get(return200)

router.route('/search/byDisplayName/:name').get(searchUserByDisplayNameALL)
router.route('/search/byUsername/:name').get(searchUserByUsernameALL)
router.route('/search/byDisplayName/oneResult/:name').get(searchUserByDisplayNameOneResult)
router.route('/search/byUsername/oneResult/:name').get(searchUserByUsernameOneResult)
router.route('/search/byUsername/:nResults/:name').get(searchUserByUsernameNResults)
router.route('/search/byUsername/:nResults/:name').get(searchUserByDisplayNameNResults)

router.route('/:userName/characters/').put(setUserCharacters).patch(updateUserCharacters)
router.route('/:userName/debt').get(getUserDebt)

router.route('/smm/:userName').put(selectSMM).delete(removeSMM)
router.route('/smm/allRepliesToUser/:userName').get(getAllRepliesToUsers)

router.route('/:userName/password').patch(changePassword)

router.route('/mod/search').post(findUsers)


module.exports = router
