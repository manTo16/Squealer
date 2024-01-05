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
  getUserImpressions
} = require ('../controllers/userController.js')


router.route('/').get(getAllUsers)/*.post(addNewUser)*/
router.route('/:userName/posts').get(getUserPosts)
router.route('/:userName').get(getUser).patch(updateUser).delete(deleteUser)
router.route('/:userName/channels').get(verifyToken,getUserChannels)
router.route('/:userName/impressions').get(getUserImpressions)
module.exports = router
