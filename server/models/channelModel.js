const mongoose = require('mongoose')

const channelSchema = mongoose.Schema({
  channelName: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  reserved: {
    type: Boolean,
    required: true
  },
  postsIds: {
    type: [String],
    default: []
  },
  usernames: {  
      owners: {
          type: [String],
          default: []
      },
      writers: {
          type: [String],
          default: []
      },
      readers: {
          type: [String],
          default: []
      },
      subs: {
          type: [String],
          default: []
      }
  }
})

module.exports = mongoose.model("Channel",channelSchema)