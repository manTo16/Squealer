const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createChannel,
  addUserToChannel,
  getChannelPostIds,
  searchChannelByChannelName,
  searchChannelByChannelNameOneResult,
  getChannelData
} = require('../controllers/channelController.js')

router.route('/').post(verifyToken,createChannel)
router.route('/:channelName').post(addUserToChannel).get(getChannelPostIds)

router.route('/data/:channelName').get(getChannelData)

router.route('/search/byChannelName/:channelName').get(searchChannelByChannelName)
router.route('/search/byChannelName/oneResult/:channelName').get(searchChannelByChannelNameOneResult)

module.exports = router