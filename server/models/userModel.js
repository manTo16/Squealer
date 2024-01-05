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
    dailyChar: Number,
    weeklyChar: Number,
    monthlyChar: Number,
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