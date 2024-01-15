const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createChannel,
  addUserToChannel,
  getChannelPostIds,
  searchChannelByChannelName
} = require('../controllers/channelController.js')

router.route('/').post(verifyToken,createChannel)
router.route('/:channelName').post(addUserToChannel).get(getChannelPostIds)

router.route('/search/byChannelName/:channelName').get(searchChannelByChannelName)

module.exports = router