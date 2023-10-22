const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    creationDate: {
      type: Date,
      default: new Date()
    }
  }
)

module.exports = mongoose.model("User",userSchema)