const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      max: 20
    },
    displayName: {
      type: String,
      required: true,
      max: 20
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    creationDate: {
      type: Date,
      default: new Date()
    },
    password: {
      type: String,
      required: true,
      min:6
    },
    channels: {
      type: [String],
      default: []
    },
    ownedChannels: {
      type: [String],
      default: []
    },
    dailyChar: {
      type: Number,
      default: 0
    },
    weeklyChar: {
      type: Number,
      default: 0
    },
    monthlyChar: {
      type: Number,
      default: 0
    },
    debtChar: {
      type: Number,
      default: 0
    },
    userImage: String,
    impressedPostIds: {
      veryLikes: {
        type: [String],
        default: []
      },
      likes: {
        type: [String],
        default: []
      },
      dislikes: {
        type: [String],
        default: []
      },
      veryDislikes: {
        type: [String],
        default: []
      },
      views: {
        type: [String],
        default: []
      }
    },

    verified: {
      type: Boolean,
      default: false
    },
    pro: {
      type: Boolean,
      default: false
    },
    smm: {
      type: Boolean,
      default: false,
    },
    personalSMM: {
      type: String,
      default: "",
    },
    smmClients: {
      type: [String],
      default: []
    },
    moderator: {
      type: Boolean,
      default: false,
    }
  }
)

module.exports = mongoose.model("User",userSchema)