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
    }
  }
)

module.exports = mongoose.model("User",userSchema)