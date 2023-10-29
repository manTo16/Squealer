const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  //addNewUser,
  getUserPosts,
  getUser,
  updateUser,
  deleteUser
} = require ('../controllers/userController.js')


router.route('/').get(getAllUsers)/*.post(addNewUser)*/
router.route('/:username/posts').get(getUserPosts)
router.route('/:userName').get(getUser).patch(updateUser).delete(deleteUser)
module.exports = router
