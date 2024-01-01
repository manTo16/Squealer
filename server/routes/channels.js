const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createChannel,
  addUserToChannel,
  getChannelPosts
} = require('../controllers/channelController.js')

router.route('/').post(verifyToken,createChannel)
router.route('/:channelName').post(addUserToChannel).get(getChannelPosts)

module.exports = router