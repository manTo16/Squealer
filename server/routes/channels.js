const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const {
  createChannel,
  addUserToChannel
} = require('../controllers/channelController.js')

router.route('/').post(verifyToken,createChannel)
router.route('/:channelName').post(addUserToChannel)

module.exports = router